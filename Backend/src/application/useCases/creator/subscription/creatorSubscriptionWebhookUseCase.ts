import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IMailService } from "@/domain/interface/service/IMailServices";
import { renderTemplate } from "@/utils/renderTemplates";
import { logger } from "@/utils/logger";
import path from "node:path";
import Stripe from "stripe";

export class CreatorSubscriptionWebhookUseCase implements ICreatorSubscriptionWebhookUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _subscriptionRepo: ISubscriptionRepository,
        private _stripeService: IStripeService,
        private _mailService: IMailService
    ) { }

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

                // Idempotency guard — skip if already processed
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
                }
            }
        }
    }
}

