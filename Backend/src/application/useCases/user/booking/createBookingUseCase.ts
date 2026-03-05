import { CreateBookingRequestDTO } from "@/domain/dto/booking/createBookingRequestDto";
import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { AppError } from "@/domain/errors/appError";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import { BookingStatus } from "@/utils/bookingStatus";
import { StatusCode } from "@/utils/statusCodes";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _packageRepo: IPackageRepository,
    private _stripeService: IStripeService
  ) { }
  async createBooking(
    userId: string,
    data: CreateBookingRequestDTO
  ): Promise<CheckoutSessionResponseDTO> {


    const pkg = await this._packageRepo.findById(data.packageId);
    if (!pkg) throw new Error("Package not found");

    const isAvailable = await this._bookingRepo.checkAvailability(data.packageId, new Date(data.bookingDate))
    if (!isAvailable) throw new AppError("Date already booked", StatusCode.CONFLICT)

    const booking = await this._bookingRepo.create({
      userId,
      packageId: data.packageId,
      amount: pkg.price,
      status: BookingStatus.PENDING,
      bookingDate: new Date(data.bookingDate),
      location: data.location,
    });

    const creatorId = typeof pkg.creatorId === "string"
      ? pkg.creatorId
      : String((pkg.creatorId as unknown as Record<string, unknown>)?._id || (pkg.creatorId as unknown as Record<string, unknown>)?.id);

    const session = await this._stripeService.createCheckoutSession({
      bookingId: booking.id!,
      creatorId: creatorId,
      packageName: pkg.title,
      amount: pkg.price,
      successUrl: `${data.baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${data.baseUrl}/payment-cancel?booking_id=${booking.id}`,
      type: "booking",
    });

    await this._bookingRepo.update(booking.id!, {
      stripeSessionId: session.id,
    });

    return session;
  }
}