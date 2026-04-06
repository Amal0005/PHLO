import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IListBookingsUseCase } from "@/domain/interfaces/user/booking/IListbookingUseCase";

export class ListBookingUseCase implements IListBookingsUseCase{
    constructor(
        private _bookingRepo:IBookingRepository
    ){}
    async listBookings(userId: string, page: number, limit: number): Promise<{ bookings: BookingResponseDTO[], totalCount: number }> {
        const { bookings, totalCount } = await this._bookingRepo.findByUser(userId, page, limit);
        return {
            bookings: bookings.map((item) => BookingMapper.toDto(item)),
            totalCount
        };
    }
}