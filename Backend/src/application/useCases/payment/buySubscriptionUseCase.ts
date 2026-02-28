import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";

export class BuySubscriptionUseCase implements IBuySubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository,
        private _stripeService: IStripeService
    ) {}
    async buySubscription(creatorId: string, subscriptionId: string): Promise<CheckoutSessionResponseDTO> {
        const plan = await this._subscriptionRepo.findById(subscriptionId)
        if (!plan) {
            throw new Error("Subscription plan is not found")
        }

        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

        return await this._stripeService.createCheckoutSession({
            subscriptionId,
            creatorId,
            packageName: plan.name,
            amount: plan.price,
            successUrl: `${FRONTEND_URL}/creator/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${FRONTEND_URL}/creator/subscription-cancel`,
            type: "subscription"
        })
    }
}