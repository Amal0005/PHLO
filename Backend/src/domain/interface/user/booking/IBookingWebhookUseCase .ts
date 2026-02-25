import Stripe from "stripe";

export interface IBookingWebhookUseCase {
  handleWebhook(payload: string | Buffer, signature: string): Promise<void>;
  handleEvent(event: Stripe.Event): Promise<void>;
}
