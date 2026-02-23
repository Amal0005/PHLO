import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";

export class BuySubscriptionUseCase implements IBuySubscriptionUseCase {
    constructor(
        private _subscriptionRepo:ISubscriptionRepository,
        private _stripeService:IStripeService
    ){}
    async buySubscription(creatorId: string, subscriptionId: string, successUrl: string, cancelUrl: string): Promise<CheckoutSessionResponseDTO> {
        console.log("subIddddddddddddddd",subscriptionId);
        
        const plan = await this._subscriptionRepo.findById(subscriptionId)
        console.log("plammmmm",plan)
        if (!plan) {
            console.error("BuySubscriptionUseCase: Plan not found for ID:", subscriptionId);
            throw new Error("Subscription plan is not found")
        }
        console.log("BuySubscriptionUseCase: Found plan:", plan.name, "Price:", plan.price);

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