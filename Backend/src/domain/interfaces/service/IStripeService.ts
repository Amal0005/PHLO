import type { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import type { CreateCheckoutSessionDTO } from "@/domain/dto/payment/createCheckoutSessionDto";
import type Stripe from "stripe";

export interface IStripeService {
  createCheckoutSession(
    data: CreateCheckoutSessionDTO
  ): Promise<CheckoutSessionResponseDTO>;

  retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null>;

  constructEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event;
}
