import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ISubscriptionRepository } from "@/domain/interface/repository/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { ICreditWalletUseCase } from "@/domain/interface/wallet/ICreditWalletUseCase";
import { IMailService } from "@/domain/interface/service/IMailServices";
import { renderTemplate } from "@/utils/renderTemplates";
import { logger } from "@/utils/logger";
import path from "node:path";
import Stripe from "stripe";

import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

export class CreatorSubscriptionWebhookUseCase implements ICreatorSubscriptionWebhookUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _subscriptionRepo: ISubscriptionRepository,
        private _stripeService: IStripeService,
        private _mailService: IMailService,
        private _creditWalletUseCase: ICreditWalletUseCase,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _userRepo: IUserRepository
    ) {}

    async handle(payload: string | Buffer, signature: string) {
        const event = this._stripeService.constructEvent(payload, signature);
        await this.handleEvent(event);
    }

    async handleEvent(event: Stripe.Event) {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.metadata?.type === "subscription") {
                const { creatorId, subscriptionId } = session.metadata;

                if (!creatorId || !subscriptionId) {
                    logger.warn("Webhook missing creatorId or subscriptionId");
                    return;
                }

                const plan = await this._subscriptionRepo.findById(subscriptionId);
                if (!plan) {
                    logger.warn("Subscription plan not found", { subscriptionId });
                    return;
                }

                const creator = await this._creatorRepo.findById(creatorId);

                const alreadyProcessed =
                    creator?.subscription?.stripeSessionId === session.id ||
                    creator?.upcomingSubscription?.stripeSessionId === session.id;
                if (alreadyProcessed) {
                    logger.info("Webhook already processed for this session", { sessionId: session.id });
                    return;
                }

                const now = new Date();
                const hasActiveSubscription =
                    creator?.subscription?.status === "active" &&
                    new Date(creator.subscription.endDate) > now;

                const logoAttachment = [{
                    filename: "Logo_white.png",
                    path: path.join(process.cwd(), "public", "Logo_white.png"),
                    cid: "phlo-logo",
                }];

                if (hasActiveSubscription) {
                    // Queue as upcoming — starts exactly when the current plan ends
                    const startDate = new Date(creator!.subscription!.endDate);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + plan.duration * 30);

                    await this._creatorRepo.updateProfile(creatorId, {
                        upcomingSubscription: {
                            planId: subscriptionId,
                            planName: plan.name,
                            status: "active",
                            startDate,
                            endDate,
                            stripeSessionId: session.id,
                        },
                    });
                    logger.info("Upcoming subscription queued", { creatorId, planName: plan.name });

                    const html = renderTemplate("subscriptionQueued.html", {
                        name: creator!.fullName,
                        planName: plan.name,
                        startDate: startDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
                        endDate: endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
                    });
                    await this._mailService.sendMail(creator!.email, "Your Subscription Upgrade is Queued", html, logoAttachment);

                    // Credit Admin Wallet (Unified)
                    await this._creditAdminWallet(plan, creator, session.id);

                    // Send Notification to Creator
                    await this._sendNotificationUseCase.sendNotification({
                        recipientId: creatorId,
                        type: NotificationType.ACCOUNT,
                        title: "Subscription Queued",
                        message: `Your upgrade to ${plan.name} is queued and will start on ${startDate.toLocaleDateString()}`,
                        isRead: false
                    });

                    // Send Notification to Admin
                    const adminId = await this._userRepo.findAdminId();
                    if (adminId) {
                        await this._sendNotificationUseCase.sendNotification({
                            recipientId: adminId,
                            type: NotificationType.WALLET,
                            title: "Wallet Credit (Subscription Queued)",
                            message: `Admin wallet credited for ${creator?.fullName || 'Creator'} upgrade to ${plan.name} (Queued).`,
                            isRead: false
                        });
                    }
                } else {
                    // No active subscription — activate immediately
                    const startDate = now;
                    const endDate = new Date();
                    endDate.setDate(startDate.getDate() + plan.duration * 30);

                    await this._creatorRepo.updateProfile(creatorId, {
                        subscription: {
                            planId: subscriptionId,
                            planName: plan.name,
                            status: "active",
                            startDate,
                            endDate,
                            stripeSessionId: session.id,
                        },
                    });
                    logger.info("Creator subscription activated", { creatorId, planName: plan.name });

                    const html = renderTemplate("subscriptionActivated.html", {
                        name: creator!.fullName,
                        planName: plan.name,
                        endDate: endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
                    });
                    await this._mailService.sendMail(creator!.email, "Your Subscription is Now Active", html, logoAttachment);

                    // Credit Admin Wallet (Unified)
                    await this._creditAdminWallet(plan, creator, session.id);

                    // Send Notification to Creator
                    await this._sendNotificationUseCase.sendNotification({
                        recipientId: creatorId,
                        type: NotificationType.ACCOUNT,
                        title: "Subscription Activated",
                        message: `Your ${plan.name} subscription is now active!`,
                        isRead: false
                    });

                    // Send Notification to Admin
                    const adminId = await this._userRepo.findAdminId();
                    if (adminId) {
                        await this._sendNotificationUseCase.sendNotification({
                            recipientId: adminId,
                            type: NotificationType.WALLET,
                            title: "Wallet Credit (Subscription)",
                            message: `Admin wallet credited for ${creator?.fullName || 'Creator'} purchase of ${plan.name} subscription.`,
                            isRead: false
                        });
                    }
                }
            }
        }
    }

    private async _creditAdminWallet(plan: any, creator: any, sessionId: string) {
        try {
            logger.info("Attempting to credit admin wallet", {
                price: plan.price,
                planName: plan.name,
                creatorId: creator?._id
            });

            await this._creditWalletUseCase.creditWallet("admin", "admin", plan.price, {
                amount: plan.price,
                type: "credit",
                description: `Subscription purchase: ${plan.name} for ${creator?.fullName || 'Creator'}`,
                source: "subscription",
                sourceId: sessionId,
                relatedName: creator?.fullName || 'Creator'
            });
            logger.info("Admin wallet credited for subscription", { sessionId, amount: plan.price });
        } catch (error) {
            logger.error("Failed to credit admin wallet for subscription", {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                sessionId,
                planPrice: plan?.price,
                planName: plan?.name
            });
        }
    }
}

