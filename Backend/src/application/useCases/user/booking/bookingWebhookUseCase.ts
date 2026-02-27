import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { BookingStatus } from "@/utils/bookingStatus";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

export class BookingWebhookUseCase implements IBookingWebhookUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _stripeService: IStripeService
  ) { }

  async handleWebhook(payload: string | Buffer, signature: string): Promise<void> {
    const event = this._stripeService.constructEvent(payload, signature);
    await this.handleEvent(event);
  }

  async handleEvent(event: Stripe.Event): Promise<void> {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        // Idempotency: check current status before updating
        const booking = await this._bookingRepo.findById(bookingId);
        if (booking && booking.status === BookingStatus.COMPLETED) {
          logger.info("Booking already completed", { bookingId });
          return;
        }
        await this._bookingRepo.updateStatus(bookingId, BookingStatus.COMPLETED);
        logger.info("Booking completed via webhook", { bookingId });
      }
    }
  }
}