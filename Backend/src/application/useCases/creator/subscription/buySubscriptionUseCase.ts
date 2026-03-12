import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repository/ISubscriptionRepositories";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/constants/statusCodes";

export class BuySubscriptionUseCase implements IBuySubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository,
        private _stripeService: IStripeService,
        private _creatorRepo: ICreatorRepository
    ) { }
    async buySubscription(creatorId: string, subscriptionId: string, successUrl: string, cancelUrl: string): Promise<CheckoutSessionResponseDTO> {
        const creator = await this._creatorRepo.findById(creatorId);
        if (creator?.upcomingSubscription) {
            throw new AppError("You already have an upcoming subscription queued. Please wait for it to activate.", StatusCode.BAD_REQUEST);
        }

        const plan = await this._subscriptionRepo.findById(subscriptionId)
        if (!plan) {
            throw new AppError("Subscription plan is not found", StatusCode.NOT_FOUND)
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