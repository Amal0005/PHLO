import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";

export interface IListBookingsUseCase {
  listBookings(userId: string): Promise<BookingResponseDTO[]>;
}
