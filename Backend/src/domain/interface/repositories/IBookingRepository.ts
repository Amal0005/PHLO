import { IBaseRepository } from "./IBaseRepository";
import { BookingEntity } from "@/domain/entities/bookingEntity";
import { BookingStatus } from "@/utils/bookingStatus";

export interface IBookingRepository extends IBaseRepository<BookingEntity> {

  findByStripeSessionId(sessionId: string): Promise<BookingEntity | null>;
  findByUser(userId: string): Promise<BookingEntity[]>;
  updateStatus(id: string,status: BookingStatus): Promise<BookingEntity | null>;
}
