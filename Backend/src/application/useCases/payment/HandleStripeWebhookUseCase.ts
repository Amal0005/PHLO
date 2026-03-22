import { IHandleStripeWebhookUseCase } from "@/domain/interface/payment/IHandleStripeWebhookUseCase";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { IWallpaperWebhookUseCase } from "@/domain/interface/user/wallpaper/IWallpaperWebhookUseCase";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
    constructor(
        private _stripeService: IStripeService,
        private _bookingWebhookUseCase: IBookingWebhookUseCase,
        private _creatorSubscriptionWebhookUseCase: ICreatorSubscriptionWebhookUseCase,
        private _wallpaperWebhookUseCase: IWallpaperWebhookUseCase
    ) {}

    async handleWebhook(rawBody: string | Buffer, signature: string): Promise<{ received: boolean }> {
        try {
            const event = this._stripeService.constructEvent(rawBody, signature);
            logger.info("Webhook received and verified", { type: event.type, id: event.id });

            if (event.type === "checkout.session.completed") {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadataType = session.metadata?.type;

                if (metadataType === "subscription") {
                    await this._creatorSubscriptionWebhookUseCase.handleEvent(event);
                } else if (metadataType === "wallpaper") {
                    await this._wallpaperWebhookUseCase.handleEvent(event);
                } else {
                    await this._bookingWebhookUseCase.handleEvent(event);
                }
            }

            return { received: true };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            logger.error("Webhook processing error", { error: message });
            throw new Error(`Webhook Error: ${message}`);
        }
    }
}
