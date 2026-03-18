import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { AppError } from "@/domain/errors/appError";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { ICancelBookingUseCase } from "@/domain/interface/user/booking/ICancelBookingUseCase";
import { BookingStatus } from "@/constants/bookingStatus";
import { StatusCode } from "@/constants/statusCodes";

import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";

export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _packageRepo: IPackageRepository,
    private _sendNotificationUseCase: ISendNotificationUseCase,
    private _walletRepo: IWalletRepository
  ) {}
  async cancelBooking(userId: string, sessionId: string): Promise<BookingResponseDTO> {
    const booking = await this._bookingRepo.findByStripeSessionId(sessionId)
    if (!booking) throw new Error("Booking not found")
    const bookingUserId = typeof booking.userId === 'string' ? booking.userId : (booking.userId as unknown as Record<string, unknown>)._id?.toString() || (booking.userId as unknown as Record<string, unknown>).id?.toString();
    if (bookingUserId !== userId) {
      throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);
    }
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.COMPLETED) {
      throw new AppError("Booking cannot be cancelled in its current state", StatusCode.BAD_REQUEST);
    }

    const now = new Date();
    const createdAt = new Date(booking.createdAt || now);
    const bookingDate = new Date(booking.bookingDate);

    const creationDiffH = (now.getTime() - createdAt.getTime()) / (1000 * 3600);
    const isWithinGracePeriod = creationDiffH <= 24;

    const sessionDiffH = (bookingDate.getTime() - now.getTime()) / (1000 * 3600);
    const isBeforeSessionCutoff = sessionDiffH >= 120;

    let refundAmount = 0;
    let refundPercentage = 0;
    let refundReason = "";

    if (booking.status === BookingStatus.COMPLETED) {
      if (isWithinGracePeriod) {
        refundPercentage = 100;
        refundAmount = booking.amount;
        refundReason = "within 24h grace period from booking creation";
      } else if (isBeforeSessionCutoff) {
        refundPercentage = 50;
        refundAmount = Math.round(booking.amount * 0.5);
        refundReason = "before 5-day session cutoff";
      } else {
        refundReason = "after session cutoff and outside grace period";
      }
    }

    if (refundAmount > 0) {
      const bookingIdStr = (booking.id || (booking as unknown as { _id: string })._id) as string;

      await this._walletRepo.updateBalance("admin", "admin", -refundAmount, {
        amount: refundAmount,
        type: "debit",
        description: `Refund (${refundPercentage}%) for booking ${bookingIdStr} - ${refundReason}`,
        source: "booking",
        sourceId: bookingIdStr,
        relatedName: "user_refund"
      });

      await this._walletRepo.updateBalance(userId, "user", refundAmount, {
        amount: refundAmount,
        type: "credit",
        description: `Refund (${refundPercentage}%) for booking ${bookingIdStr} - ${refundReason}`,
        source: "booking",
        sourceId: bookingIdStr,
      });

      await this._bookingRepo.updatePaymentStatus(booking.id!, refundPercentage === 100 ? "refunded" : "partially_refunded");
    }

    const updatedBooking = await this._bookingRepo.updateStatus(booking.id!, BookingStatus.CANCELLED);

    if (!updatedBooking) {
      throw new AppError("Failed to cancel booking", StatusCode.INTERNAL_SERVER_ERROR);
    }

    const pkg = await this._packageRepo.findById(booking.packageId as string);
    if (pkg) {
      const creatorId = typeof pkg.creatorId === 'string' ? pkg.creatorId : (pkg.creatorId as unknown as { _id?: { toString(): string } })._id?.toString() || (pkg.creatorId as unknown as { id?: { toString(): string } }).id?.toString();
      if (creatorId) {
        await this._sendNotificationUseCase.sendNotification({
          recipientId: creatorId,
          type: NotificationType.BOOKING,
          title: "Booking Cancelled",
          message: `A booking for ${pkg.title} has been cancelled by the user. ${refundAmount > 0 ? `Amount (${refundPercentage}%) refunded to user (${refundReason}).` : 'Payment held (cancellation after cutoff).'}`,
          isRead: false
        });
      }

      await this._sendNotificationUseCase.sendNotification({
        recipientId: userId,
        type: NotificationType.BOOKING,
        title: "Booking Cancelled",
        message: `Your booking for ${pkg.title} has been successfully cancelled. ${refundAmount > 0 ? `${refundPercentage}% refund (₹${refundAmount}) has been initiated to your wallet (${refundReason}).` : 'Cancellation terms: No refund for cancellations within 5 days of the session.'}`,
        isRead: false
      });
    }

    return BookingMapper.toDto(updatedBooking);
  }

}
