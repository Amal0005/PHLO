import Stripe from "stripe";

export interface ICreatorSubscriptionWebhookUseCase {
    handle(payload: string | Buffer, signature: string): Promise<void>;
    handleEvent(event: Stripe.Event): Promise<void>;
}
