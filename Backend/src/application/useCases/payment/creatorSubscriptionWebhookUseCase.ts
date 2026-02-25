import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

export class CreatorSubscriptionWebhookUseCase implements ICreatorSubscriptionWebhookUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _subscriptionRepo: ISubscriptionRepository,
        private _stripeService: IStripeService
    ) { }

    async handle(payload: string | Buffer, signature: string) {
        const event = this._stripeService.constructEvent(payload, signature);
        await this.handleEvent(event);
    }

    async handleEvent(event: Stripe.Event) {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;
            if (session.metadata?.type === "subscription") {
                const { creatorId, subscriptionId } = session.metadata;

                if (!creatorId || !subscriptionId) {
                    logger.warn("Webhook missing creatorId or subscriptionId in metadata");
                    return;
                }

                const plan = await this._subscriptionRepo.findById(subscriptionId);
                if (!plan) {
                    logger.warn("Subscription plan not found", { subscriptionId });
                    return;
                }

                // Idempotency: check if already activated with this session
                const creator = await this._creatorRepo.findById(creatorId);
                if (creator?.subscription?.stripeSessionId === session.id) {
                    logger.info("Subscription already activated for this session", { sessionId: session.id });
                    return;
                }

                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(startDate.getDate() + (plan.duration * 30));

                await this._creatorRepo.updateProfile(creatorId, {
                    subscription: {
                        planId: subscriptionId,
                        planName: plan.name,
                        status: "active",
                        startDate,
                        endDate,
                        stripeSessionId: session.id
                    }
                });

                logger.info("Creator subscription activated", { creatorId, planName: plan.name });
            }
        }
    }
}
