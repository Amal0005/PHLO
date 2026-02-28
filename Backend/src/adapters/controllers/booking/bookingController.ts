import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { AppError } from "@/domain/errors/appError";
import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import { IListBookingsUseCase } from "@/domain/interface/user/booking/IListbookingUseCase";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { StatusCode } from "@/utils/statusCodes";
import { Response } from "express";
import { logger } from "@/utils/logger";

export class BookingController {
  constructor(
    private _createBookingUseCase: ICreateBookingUseCase,
    private _webhookUseCase: IBookingWebhookUseCase,
    private _listBookingsUseCase: IListBookingsUseCase,
    private _creatorSubscriptionWebhookUseCase: ICreatorSubscriptionWebhookUseCase,
    private _stripeService: IStripeService,
  ) { }
  async CreateBooking(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const session = await this._createBookingUseCase.createBooking(
        userId,
        req.body,
      );
      res.status(StatusCode.OK).json(session);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unknown error occurred" });
      }
    }
  }
  async ListBookings(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const bookings = await this._listBookingsUseCase.listBookings(userId);
      res.status(StatusCode.OK).json({ success: true, data: bookings });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
  async handleWebhook(req: AuthRequest, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) {
      res.status(400).send("Missing stripe-signature header");
      return;
    }
    try {
      const payload = (req as any).rawBody || req.body;

      // Construct event ONCE and pass the parsed event to handlers
      const event = this._stripeService.constructEvent(payload, sig);

      logger.info("Webhook received", { type: event.type, id: event.id });

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const metadataType = session.metadata?.type;

        if (metadataType === "subscription") {
          await this._creatorSubscriptionWebhookUseCase.handleEvent(event);
        } else {
          await this._webhookUseCase.handleEvent(event);
        }
      } else if (
        event.type === "invoice.payment_succeeded" ||
        event.type === "invoice.payment_failed" ||
        event.type === "customer.subscription.deleted" ||
        event.type === "customer.subscription.updated"
      ) {
        // These are related to recurring subscriptions
        await this._creatorSubscriptionWebhookUseCase.handleEvent(event);
      }

      res.status(200).json({ received: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("Webhook error", { error: message });
      res.status(400).send(`Webhook Error: ${message}`);
    }
  }
}