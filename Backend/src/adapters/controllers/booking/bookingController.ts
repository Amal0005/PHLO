import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { AppError } from "@/domain/errors/appError";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import { IListBookingsUseCase } from "@/domain/interface/user/booking/IListbookingUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Response } from "express";

export class BookingController {
  constructor(
    private _createBookingUseCase: ICreateBookingUseCase,
    private _webhookUseCase: IBookingWebhookUseCase,
    private _listBookingsUseCase: IListBookingsUseCase

  ) {}
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
    console.log("Webhook received with signature:", sig ? "Yes" : "No");
    try {
      const payload = (req as any).rawBody || req.body;
      console.log("Payload type:", typeof payload);
      await this._webhookUseCase.handleWebhook(payload, sig);
      res.status(200).json({ received: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Webhook controller error:", message);
      res.status(400).send(`Webhook Error: ${message}`);
    }
  }
}
