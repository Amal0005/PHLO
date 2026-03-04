import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IGetBookingDetailUseCase } from "@/domain/interface/user/booking/IGetBookingDetailUseCase";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { BookingStatus } from "@/utils/bookingStatus";

export class GetBookingDetailUseCase implements IGetBookingDetailUseCase {
    constructor(
        private _bookingRepo: IBookingRepository,
        private _stripeService: IStripeService
    ) {}
    async getBookingDetail(sessionId: string): Promise<BookingResponseDTO | null> {
        const booking = await this._bookingRepo.findByStripeSessionId(sessionId);
        if (!booking) return null;

        if (booking.status === BookingStatus.PENDING) {
            const session = await this._stripeService.retrieveCheckoutSession(sessionId);
            if (session?.payment_status === 'paid') {
                booking.status = BookingStatus.COMPLETED;
            }
        }

        return BookingMapper.toDto(booking);
    }
}
