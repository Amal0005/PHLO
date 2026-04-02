import type { IBaseRepository } from "@/domain/interfaces/repository/IBaseRepository";
import type { BookingEntity } from "@/domain/entities/bookingEntity";
import type { BookingStatus } from "@/constants/bookingStatus";

export interface IBookingRepository extends IBaseRepository<BookingEntity> {

  findByStripeSessionId(sessionId: string): Promise<BookingEntity | null>;
  findByUser(userId: string): Promise<BookingEntity[]>;
  updateStatus(id: string, status: BookingStatus): Promise<BookingEntity | null>;
  findExistingBooking(packageId: string, date: Date): Promise<BookingEntity | null>;
  checkAvailability(packageId: string, date: Date): Promise<boolean>;
  findByCreatorId(creatorId: string): Promise<BookingEntity[]>
  findBookingsForPaymentRelease(date: Date): Promise<BookingEntity[]>
  updatePaymentStatus(id: string, paymentStatus: "held" | "released" | "refunded" | "partially_refunded"): Promise<BookingEntity | null>
  findAllPopulated(filter: Record<string, unknown>): Promise<BookingEntity[]>;
}
