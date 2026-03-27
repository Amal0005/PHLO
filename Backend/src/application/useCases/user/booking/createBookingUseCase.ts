import { CreateBookingRequestDTO } from "@/domain/dto/booking/createBookingRequestDto";
import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { AppError } from "@/domain/errors/appError";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { ILeaveRepository } from "@/domain/interface/repository/ILeaveRepository";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { ICreateBookingUseCase } from "@/domain/interface/user/booking/ICreateBookingUseCase";
import { BookingStatus } from "@/constants/bookingStatus";
import { StatusCode } from "@/constants/statusCodes";
import { CreatorEntity } from "@/domain/entities/creatorEntities";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _packageRepo: IPackageRepository,
    private _leaveRepo: ILeaveRepository,
    private _stripeService: IStripeService
  ) {}
  async createBooking(
    userId: string,
    data: CreateBookingRequestDTO
  ): Promise<CheckoutSessionResponseDTO> {


    const pkg = await this._packageRepo.findById(data.packageId);
    if (!pkg) throw new AppError("Package not found", StatusCode.NOT_FOUND);

    const bookingDate = new Date(data.bookingDate);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const creatorId = typeof pkg.creatorId === "string"
      ? pkg.creatorId
      : (pkg.creatorId as CreatorEntity)._id?.toString() || "";

    if (!creatorId) {
      throw new AppError("Creator not found for this package", StatusCode.NOT_FOUND);
    }

    const isCreatorOnLeave = await this._leaveRepo.isDateBlocked(creatorId, bookingDate);
    if (isCreatorOnLeave) {
      throw new AppError("Creator is unavailable on this date", StatusCode.CONFLICT);
    }

    const existing = await this._bookingRepo.findExistingBooking(data.packageId, bookingDate);
    if (existing) {
      const existingId = typeof existing.userId === 'string' 
        ? existing.userId 
        : (existing.userId as unknown as Record<string, unknown>)._id?.toString();

      if (existingId === userId) {
        throw new AppError("You already have an active booking session or confirmed booking for this package on this date. Please check your profile.", StatusCode.CONFLICT);
      }
      throw new AppError("This date is already booked by another user.", StatusCode.CONFLICT);
    }

    const booking = await this._bookingRepo.create({
      userId,
      packageId: data.packageId,
      amount: pkg.price,
      status: BookingStatus.PENDING,
      bookingDate: bookingDate,
      location: data.location,
    });

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