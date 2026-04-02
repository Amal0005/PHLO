import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";

export interface IListCreatorBookingsUseCase {
    listBookings(creatorId: string): Promise<BookingResponseDTO[]>
}