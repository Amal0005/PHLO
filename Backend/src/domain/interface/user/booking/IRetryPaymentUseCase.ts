import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";

export interface IRetryPaymentUseCase {
    retryPayment(sessionId: string, baseUrl: string): Promise<CheckoutSessionResponseDTO>;
}
