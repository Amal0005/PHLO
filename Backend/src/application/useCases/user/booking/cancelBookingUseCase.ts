import { BookingEntity } from "@/domain/entities/bookingEntity";
import { AppError } from "@/domain/errors/appError";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { ICancelBookingUseCase } from "@/domain/interface/user/booking/ICancelBookingUseCase";
import { BookingStatus } from "@/utils/bookingStatus";
import { StatusCode } from "@/utils/statusCodes";

export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    private _bookingRepo: IBookingRepository
  ) {}
  async cancelBooking(userId: string, sessionId: string): Promise<BookingEntity> {
    const booking = await this._bookingRepo.findByStripeSessionId(sessionId)
    if (!booking) throw new Error("Booking not found")
    const bookingUserId = typeof booking.userId === 'string' ? booking.userId : (booking.userId as any)._id?.toString() || (booking.userId as any).id?.toString();
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
    return updatedBooking;
  }

}
