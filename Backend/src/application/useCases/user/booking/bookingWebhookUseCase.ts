import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { BookingStatus } from "@/utils/bookingStatus";
import Stripe from "stripe";

export class BookingWebhookUseCase implements IBookingWebhookUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _stripeService: IStripeService
  ) { }
  async handleWebhook(payload: string | Buffer, signature: string): Promise<void> {
    const event = await this._stripeService.constructEvent(payload, signature)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await this._bookingRepo.updateStatus(bookingId, BookingStatus.COMPLETED);
      }
    }
  }
}