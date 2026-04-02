import type Stripe from "stripe";

export interface IWallpaperWebhookUseCase {
    handleEvent(event: Stripe.Event): Promise<void>;
}
