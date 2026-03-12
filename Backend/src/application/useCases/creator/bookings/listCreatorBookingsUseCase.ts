import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { IListCreatorBookingsUseCase } from "@/domain/interface/creator/bookings/IListCreatorBookingsUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";

export class ListCreatorBookingsUseCase implements IListCreatorBookingsUseCase {
    constructor(
        private _bookingRepo: IBookingRepository
    ) {}
    async listBookings(creatorId: string): Promise<BookingResponseDTO[]> {
        const bookings = await this._bookingRepo.findByCreatorId(creatorId)
        return bookings.map(item => BookingMapper.toDto(item))
    }
} 