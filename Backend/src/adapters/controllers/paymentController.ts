import { Request, Response } from "express";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { logger } from "@/utils/logger";
import Stripe from "stripe";
import { StatusCode } from "@/constants/statusCodes";

import { IWallpaperWebhookUseCase } from "@/domain/interface/user/wallpaper/IWallpaperWebhookUseCase";

export class PaymentController {
  constructor(
    private _bookingWebhookUseCase: IBookingWebhookUseCase,
    private _creatorSubscriptionWebhookUseCase: ICreatorSubscriptionWebhookUseCase,
    private _wallpaperWebhookUseCase: IWallpaperWebhookUseCase,
    private _stripeService: IStripeService,
  ) {}

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) {
      res.status(StatusCode.BAD_REQUEST).send("Missing stripe-signature header");
      return;
    }

    try {
      const payload =
        (req as Request & { rawBody?: Buffer | string }).rawBody || req.body;

      const event = this._stripeService.constructEvent(payload, sig);

      logger.info("Webhook received", { type: event.type, id: event.id });

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

      res.status(StatusCode.OK).json({ received: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("Webhook error", { error: message });
      res.status(StatusCode.BAD_REQUEST).send(`Webhook Error: ${message}`);
    }
  }
}

