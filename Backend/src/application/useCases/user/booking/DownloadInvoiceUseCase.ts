import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { IPdfInvoiceGenerator } from "@/domain/interface/services/IInvoiceGenerator";
import { IDownloadInvoiceUseCase } from "@/domain/interface/user/booking/IDownloadInvoiceUseCase";

export class DownloadInvoiceUseCase implements IDownloadInvoiceUseCase {
    constructor(
        private _bookingRepo: IBookingRepository,
        private _invoiceGenerator: IPdfInvoiceGenerator
    ) { }

    async downloadInvoice(sessionId: string): Promise<Buffer> {
        const booking = await this._bookingRepo.findByStripeSessionId(sessionId);
        if (!booking) throw new Error("Booking not found");
        return await this._invoiceGenerator.generateInvoice(booking);
    }
}
