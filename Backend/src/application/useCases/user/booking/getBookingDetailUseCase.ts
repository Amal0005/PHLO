import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import type { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IGetBookingDetailUseCase } from "@/domain/interfaces/user/booking/IGetBookingDetailUseCase";
import type { IStripeService } from "@/domain/interfaces/service/IStripeService";
import { BookingStatus } from "@/constants/bookingStatus";

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
