import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import type { IListCreatorBookingsUseCase } from "@/domain/interfaces/creator/bookings/IListCreatorBookingsUseCase";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";

export class ListCreatorBookingsUseCase implements IListCreatorBookingsUseCase {
    constructor(
        private _bookingRepo: IBookingRepository
    ) {}
    async listBookings(creatorId: string): Promise<BookingResponseDTO[]> {
        const bookings = await this._bookingRepo.findByCreatorId(creatorId)
        return bookings.map(item => BookingMapper.toDto(item))
    }
} 