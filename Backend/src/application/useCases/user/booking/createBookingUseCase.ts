import { CreateBookingRequestDTO } from "@/domain/dto/booking/createBookingRequestDto";
import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import { BookingStatus } from "@/utils/bookingStatus";

export class CreateBookingUseCase implements ICreateBookingUseCase {
    constructor(
        private _bookingRepo: IBookingRepository,
        private _packageRepo: IPackageRepository,
        private _stripeService: IStripeService
    ) { }
    async createBooking(userId: string, data: CreateBookingRequestDTO): Promise<CheckoutSessionResponseDTO> {
        console.log("CreateBooking received data:", JSON.stringify(data, null, 2));
        const pkg = await this._packageRepo.findById(data.packageId)
        if (!pkg) throw new Error("Package not found");

        const booking = await this._bookingRepo.create({
            userId,
            packageId: data.packageId,
            amount: pkg.price,
            status: BookingStatus.PENDING
        })
        const session = await this._stripeService.createCheckoutSession({
            bookingId: booking.id!,
            creatorId: typeof pkg.creatorId === 'string' ? pkg.creatorId : (pkg.creatorId as any)._id || (pkg.creatorId as any).id,
            packageName: pkg.title,
            amount: pkg.price,
            successUrl: `${data.baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${data.baseUrl}/payment-cancel?booking_id=${booking.id}`,
            type: "booking"
        })
        await this._bookingRepo.update(booking.id!, { stripeSessionId: session.id })
        return session
    }
}