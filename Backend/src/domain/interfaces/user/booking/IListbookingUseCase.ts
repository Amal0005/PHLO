import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";

export interface IListBookingsUseCase {
  listBookings(userId: string, page: number, limit: number): Promise<{ bookings: BookingResponseDTO[], totalCount: number }>;
}
