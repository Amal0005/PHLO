import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";

export interface IGetBookingDetailUseCase {
    getBookingDetail(sessionId: string): Promise<BookingResponseDTO | null>;
}
