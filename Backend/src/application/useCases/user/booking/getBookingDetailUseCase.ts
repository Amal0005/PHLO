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

        const dto = BookingMapper.toDto(booking);

        if (booking.status === BookingStatus.PENDING) {
            const session = await this._stripeService.retrieveCheckoutSession(sessionId);
            if (session) {
                console.log(`Booking ${booking.id} is pending. Stripe status: ${session.payment_status}`);
                if (session.payment_status !== 'paid') {
                    dto.checkoutUrl = session.url || undefined;
                    console.log(`Providing checkout URL for booking ${booking.id}: ${dto.checkoutUrl ? 'Yes' : 'No'}`);
                }
            }
        }

        return dto;
    }
}
