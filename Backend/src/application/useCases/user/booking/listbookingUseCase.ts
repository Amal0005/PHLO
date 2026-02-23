import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IListBookingsUseCase } from "@/domain/interface/user/booking/IListbookingUseCase";

export class ListBookingUseCase implements IListBookingsUseCase{
    constructor(
        private _bookingRepo:IBookingRepository
    ){}
    async listBookings(userId: string): Promise<BookingResponseDTO[]> {
        const bookings= await this._bookingRepo.findByUser(userId)
        return bookings.map((item)=>BookingMapper.toDto(item))
    }
}