import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";

export class BuySubscriptionUseCase implements IBuySubscriptionUseCase{
    constructor(
        private _subscriptionRepo:ISubscriptionRepository,
        private _stripeService:IStripeService
    ){}
    async buySubscription(creatorId: string, subscriptionId: string, successUrl: string, cancelUrl: string): Promise<CheckoutSessionResponseDTO> {
        const plan=await this._subscriptionRepo.findById(subscriptionId)
        if(!plan)throw new Error("Subscription plan is not found")

        return await this._stripeService.createCheckoutSession({
            subscriptionId,
            creatorId,
            packageName: plan.name,
            amount: plan.price,
            successUrl,
            cancelUrl,
            type: "subscription"
        })
    }
}