import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { ICreditWalletUseCase } from "@/domain/interface/admin/wallet/ICreditWalletUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { BookingStatus } from "@/utils/bookingStatus";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

export class BookingWebhookUseCase implements IBookingWebhookUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _stripeService: IStripeService,
    private _packageRepo: IPackageRepository,
    private _creatorRepo: ICreatorRepository,
    private _creditWalletUseCase: ICreditWalletUseCase
  ) {}

  async handleWebhook(payload: string | Buffer, signature: string): Promise<void> {
    const event = this._stripeService.constructEvent(payload, signature);
    await this.handleEvent(event);
  }

  async handleEvent(event: Stripe.Event): Promise<void> {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        const booking = await this._bookingRepo.findById(bookingId);
        if (booking && booking.status === BookingStatus.COMPLETED) {
          logger.info("Booking already completed", { bookingId });
          return;
        }
        await this._bookingRepo.updateStatus(bookingId, BookingStatus.COMPLETED);

        // Credit Admin Wallet
        if (booking) {
          const pkg = await this._packageRepo.findById(booking.packageId as string);
          if (pkg) {
            const creator = await this._creatorRepo.findById(pkg.creatorId as string);
            await this._creditWalletUseCase.execute("admin", "admin", booking.amount, {
              amount: booking.amount,
              type: "credit",
              description: `Booking payment: ${pkg.title} by ${creator?.fullName || 'Creator'}`,
              source: "booking",
              sourceId: bookingId,
              relatedName: creator?.fullName || 'Creator'
            });
            logger.info("Admin wallet credited for booking", { bookingId, amount: booking.amount });
          }
        }

        logger.info("Booking completed via webhook", { bookingId });
      }
    }
  }
}