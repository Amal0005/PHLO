import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IListBookingsUseCase } from "@/domain/interfaces/user/booking/IListbookingUseCase";

export class ListBookingUseCase implements IListBookingsUseCase{
    constructor(
        private _bookingRepo:IBookingRepository
    ){}
    async listBookings(userId: string): Promise<BookingResponseDTO[]> {
        const bookings= await this._bookingRepo.findByUser(userId)
        return bookings.map((item)=>BookingMapper.toDto(item))
    }
}