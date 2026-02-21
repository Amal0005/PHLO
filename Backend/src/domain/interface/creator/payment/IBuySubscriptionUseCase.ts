import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";

export interface IBuySubscriptionUseCase {
    buySubscription(creatorId: string, subscriptionId: string, successUrl: string,cancelUrl: string): Promise<CheckoutSessionResponseDTO>;
}
