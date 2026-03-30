import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { AppError } from "@/domain/errors/appError";
import type { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import type { IListBookingsUseCase } from "@/domain/interface/user/booking/IListbookingUseCase";
import type { ICheckAvailabilityUseCase } from "@/domain/interface/user/booking/ICheckAvailabilityUseCase";
import type { ICancelBookingUseCase } from "@/domain/interface/user/booking/ICancelBookingUseCase";
import type { IGetBookingDetailUseCase } from "@/domain/interface/user/booking/IGetBookingDetailUseCase";
import type { IRetryPaymentUseCase } from "@/domain/interface/user/booking/IRetryPaymentUseCase";
import type { IDownloadInvoiceUseCase } from "@/domain/interface/user/booking/IDownloadInvoiceUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import type { Response } from "express";

export class UserBookingController {
    constructor(
        private _createBookingUseCase: ICreateBookingUseCase,
        private _listBookingsUseCase: IListBookingsUseCase,
        private _checkAvailabilityUseCase: ICheckAvailabilityUseCase,
        private _cancelBookingUseCase: ICancelBookingUseCase,
        private _getBookingDetailUseCase: IGetBookingDetailUseCase,
        private _downloadInvoiceUseCase: IDownloadInvoiceUseCase,
        private _retryPaymentUseCase: IRetryPaymentUseCase
    ) {}

    async createBooking(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.BOOKING.UNAUTHORIZED });
                return;
            }
            const session = await this._createBookingUseCase.createBooking(userId, req.body);
            res.status(StatusCode.OK).json(session);
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
            }
        }
    }

    async checkAvailability(req: AuthRequest, res: Response) {
        try {
            const { packageId, date } = req.query;
            if (!packageId || !date) {
                res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.BOOKING.PACKAGE_DATE_REQUIRED });
                return;
            }
            const isAvailable = await this._checkAvailabilityUseCase.checkAvailability(
                packageId as string,
                new Date(date as string),
            );
            res.status(StatusCode.OK).json({ success: true, isAvailable });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
        }
    }

    async listBookings(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.BOOKING.UNAUTHORIZED });
                return;
            }
            const bookings = await this._listBookingsUseCase.listBookings(userId);
            res.status(StatusCode.OK).json({ success: true, data: bookings });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
        }
    }

    async getBookingDetail(req: AuthRequest, res: Response) {
        try {
            const { sessionId } = req.params;
            const booking = await this._getBookingDetailUseCase.getBookingDetail(sessionId);
            if (!booking) {
                res.status(StatusCode.NOT_FOUND).json({ message: MESSAGES.BOOKING.NOT_FOUND });
                return;
            }
            res.status(StatusCode.OK).json({ success: true, data: booking });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
        }
    }

    async cancelBooking(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const { sessionId } = req.params;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.BOOKING.UNAUTHORIZED });
                return;
            }
            await this._cancelBookingUseCase.cancelBooking(userId, sessionId);
            res.status(StatusCode.OK).json({ success: true, message: MESSAGES.BOOKING.CANCELLED });
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
            }
        }
    }

    async downloadInvoice(req: AuthRequest, res: Response) {
        try {
            const { sessionId } = req.params;
            const pdfBuffer = await this._downloadInvoiceUseCase.downloadInvoice(sessionId);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=invoice-${sessionId}.pdf`);
            res.send(pdfBuffer);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
        }
    }

    async retryPayment(req: AuthRequest, res: Response) {
        try {
            const { sessionId } = req.params;
            const { baseUrl } = req.body;
            if (!baseUrl) {
                res.status(StatusCode.BAD_REQUEST).json({ message: "Base URL is required" });
                return;
            }
            const session = await this._retryPaymentUseCase.retryPayment(sessionId, baseUrl);
            res.status(StatusCode.OK).json({ success: true, data: session });
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                const message = error instanceof Error ? error.message : MESSAGES.ERROR.UNKNOWN_ERROR;
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
            }
        }
    }
}
