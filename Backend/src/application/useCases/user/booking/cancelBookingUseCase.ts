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

export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _packageRepo: IPackageRepository,
    private _sendNotificationUseCase: ISendNotificationUseCase
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
        message: `A booking for ${pkg.title} has been cancelled by the user`,
        isRead: false
      });

      // To User
      await this._sendNotificationUseCase.sendNotification({
        recipientId: userId,
        type: NotificationType.BOOKING,
        title: "Booking Cancelled",
        message: `Your booking for ${pkg.title} has been successfully cancelled`,
        isRead: false
      });
    }

    return BookingMapper.toDto(updatedBooking);
  }

}
