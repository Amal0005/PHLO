import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { CreateCheckoutSessionDTO } from "@/domain/dto/payment/createCheckoutSessionDto";
import Stripe from "stripe";

export interface IStripeService {
  createCheckoutSession(
    data: CreateCheckoutSessionDTO
  ): Promise<CheckoutSessionResponseDTO>;

  constructEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event;
}
