import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { BookingEntity } from "@/domain/entities/bookingEntity";

export interface ICancelBookingUseCase {
  cancelBooking(userId: string, sessionId: string): Promise<BookingResponseDTO>;
}
