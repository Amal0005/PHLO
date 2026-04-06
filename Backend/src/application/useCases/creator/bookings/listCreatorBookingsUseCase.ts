import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import type { BookingEntity } from "@/domain/entities/bookingEntity";
import type { IListCreatorBookingsUseCase } from "@/domain/interfaces/creator/bookings/IListCreatorBookingsUseCase";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";

export class ListCreatorBookingsUseCase implements IListCreatorBookingsUseCase {
    constructor(
        private _bookingRepo: IBookingRepository
    ) {}
    async listBookings(creatorId: string): Promise<BookingResponseDTO[]> {
        const result = await this._bookingRepo.findByCreatorId(creatorId, 1, 50)
        return result.bookings.map((item: BookingEntity) => BookingMapper.toDto(item))
    }
}