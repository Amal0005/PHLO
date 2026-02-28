import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { CreateCheckoutSessionDTO } from "@/domain/dto/payment/createCheckoutSessionDto";
import Stripe from "stripe";

export interface IStripeService {
  createCheckoutSession(
    data: CreateCheckoutSessionDTO
  ): Promise<CheckoutSessionResponseDTO>;

  retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null>;
  retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription | null>;
  constructEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event;
}
