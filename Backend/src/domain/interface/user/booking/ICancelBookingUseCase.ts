import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";

export interface ICancelBookingUseCase {
  cancelBooking(userId: string, sessionId: string): Promise<BookingResponseDTO>;
}
