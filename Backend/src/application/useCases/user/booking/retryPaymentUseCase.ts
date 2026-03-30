import type { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { AppError } from "@/domain/errors/appError";
import type { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import type { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import type { IStripeService } from "@/domain/interface/service/IStripeService";
import type { IRetryPaymentUseCase } from "@/domain/interface/user/booking/IRetryPaymentUseCase";
import { BookingStatus } from "@/constants/bookingStatus";
import { StatusCode } from "@/constants/statusCodes";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import { PaymentMapper } from "@/application/mapper/user/paymentMapper";

export class RetryPaymentUseCase implements IRetryPaymentUseCase {
    constructor(
        private _bookingRepo: IBookingRepository,
        private _packageRepo: IPackageRepository,
        private _stripeService: IStripeService
    ) {}

    async retryPayment(sessionId: string, baseUrl: string): Promise<CheckoutSessionResponseDTO> {
        const booking = await this._bookingRepo.findByStripeSessionId(sessionId);
        if (!booking) {
            throw new AppError("Booking not found", StatusCode.NOT_FOUND);
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new AppError(`Booking status is ${booking.status}. Payment is not required.`, StatusCode.BAD_REQUEST);
        }

        const pkgId = typeof booking.packageId === 'string' ? booking.packageId : (booking.packageId as unknown as { _id?: { toString(): string } })._id?.toString() || "";
        const pkg = await this._packageRepo.findById(pkgId);
        if (!pkg) {
            throw new AppError("Package details not found", StatusCode.NOT_FOUND);
        }

        const creatorId = typeof pkg.creatorId === "string"
            ? pkg.creatorId
            : (pkg.creatorId as CreatorEntity)._id?.toString() || "";

        const sessionDto = PaymentMapper.toCreateSessionDto(booking, pkg, creatorId, baseUrl);
        const session = await this._stripeService.createCheckoutSession(sessionDto);

        // Update booking with the NEW stripeSessionId
        await this._bookingRepo.update(booking.id!, {
            stripeSessionId: session.id,
        });

        return session;
    }
}
