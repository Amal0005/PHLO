import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";

export class CreatorSubscriptionWebhookUseCase implements ICreatorSubscriptionWebhookUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _subscriptionRepo: ISubscriptionRepository,
        private _stripeService: IStripeService
    ) { }
    async handle(payload: string | Buffer, signature: string) {
        const event = this._stripeService.constructEvent(payload, signature);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;
            if (session.metadata.type === "subscription") {
                const { creatorId, subscriptionId } = session.metadata;
                const plan = await this._subscriptionRepo.findById(subscriptionId);
                if (plan) {
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
                }
            }
        }
    }

}
