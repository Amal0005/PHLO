import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { AppError } from "@/domain/errors/appError";
import { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import { IListBookingsUseCase } from "@/domain/interface/user/booking/IListbookingUseCase";
import { ICheckAvailabilityUseCase } from "@/domain/interface/user/booking/ICheckAvailabilityUseCase";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { BookingStatus } from "@/utils/bookingStatus";
import { StatusCode } from "@/utils/statusCodes";
import { Response } from "express";
import { logger } from "@/utils/logger";

export class BookingController {
  constructor(
    private _createBookingUseCase: ICreateBookingUseCase,
    private _listBookingsUseCase: IListBookingsUseCase,
    private _checkAvailabilityUseCase: ICheckAvailabilityUseCase,
    private _stripeService: IStripeService,
    private _bookingRepo: IBookingRepository,
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

  async checkAvailability(req: AuthRequest, res: Response) {
    try {
      const { packageId, date } = req.query;
      if (!packageId || !date) {
        res.status(StatusCode.BAD_REQUEST).json({ message: "Package ID and date are required" });
        return;
      }
      const isAvailable = await this._checkAvailabilityUseCase.checkAvailability(
        packageId as string,
        new Date(date as string),
      );
      res.status(StatusCode.OK).json({ success: true, isAvailable });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
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

  async GetBookingStatus(req: AuthRequest, res: Response) {
    try {
      const { sessionId } = req.params;
      const booking = await this._bookingRepo.findByStripeSessionId(sessionId);
      if (!booking) {
        res.status(StatusCode.NOT_FOUND).json({ message: "Booking not found" });
        return;
      }
      res.status(StatusCode.OK).json({ status: booking.status });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async CancelBooking(req: AuthRequest, res: Response) {
    try {
      const { sessionId } = req.params;
      const booking = await this._bookingRepo.findByStripeSessionId(sessionId);
      if (!booking) {
        res.status(StatusCode.NOT_FOUND).json({ message: "Booking not found" });
        return;
      }
      if (booking.status === BookingStatus.PENDING) {
        await this._bookingRepo.updateStatus(booking.id!, BookingStatus.CANCELLED);
        res.status(StatusCode.OK).json({ success: true, message: "Booking cancelled" });
      } else {
        res.status(StatusCode.BAD_REQUEST).json({ message: "Only pending bookings can be cancelled" });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
}
