import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { BookingEntity } from "@/domain/entities/bookingEntity";
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
  ) { }
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

    // Refund Logic (Updated):
    // 1. 100% Refund (Grace Period): If cancelled within 24 hours of MAKING the booking.
    // 2. 50% Refund: If cancelled more than 5 days (120h) BEFORE the booking date.
    // 3. No Refund: If cancelled less than 5 days (120h) before.
    
    const now = new Date();
    const createdAt = new Date(booking.createdAt || now);
    const bookingDate = new Date(booking.bookingDate);
    
    // Check Grace Period (24h from creation)
    const creationDiffH = (now.getTime() - createdAt.getTime()) / (1000 * 3600);
    const isWithinGracePeriod = creationDiffH <= 24;

    // Check Session Cutoff (5 days before session)
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
      const bookingIdStr = (booking.id || (booking as any)._id) as string;
      
      // 1. Debit Admin Wallet
      await this._walletRepo.updateBalance("admin", "admin", -refundAmount, {
        amount: refundAmount,
        type: "debit",
        description: `Refund (${refundPercentage}%) for booking ${bookingIdStr} - ${refundReason}`,
        source: "booking",
        sourceId: bookingIdStr,
        relatedName: "user_refund"
      });

      // 2. Credit User Wallet
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

    // Trigger Notifications
    const pkg = await this._packageRepo.findById(booking.packageId as string);
    if (pkg) {
      const creatorId = typeof pkg.creatorId === 'string' ? pkg.creatorId : (pkg.creatorId as any)._id?.toString() || (pkg.creatorId as any).id?.toString();

      // To Creator
      await this._sendNotificationUseCase.sendNotification({
        recipientId: creatorId,
        type: NotificationType.BOOKING,
        title: "Booking Cancelled",
        message: `A booking for ${pkg.title} has been cancelled by the user. ${refundAmount > 0 ? `Amount (${refundPercentage}%) refunded to user (${refundReason}).` : 'Payment held (cancellation after cutoff).'}`,
        isRead: false
      });

      // To User
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
