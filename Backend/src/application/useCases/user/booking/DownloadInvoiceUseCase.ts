import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IPdfInvoiceGenerator } from "@/domain/interfaces/service/IInvoiceGenerator";
import type { IDownloadInvoiceUseCase } from "@/domain/interfaces/user/booking/IDownloadInvoiceUseCase";

export class DownloadInvoiceUseCase implements IDownloadInvoiceUseCase {
    constructor(
        private _bookingRepo: IBookingRepository,
        private _invoiceGenerator: IPdfInvoiceGenerator
    ) {}

    async downloadInvoice(sessionId: string): Promise<Buffer> {
        const booking = await this._bookingRepo.findByStripeSessionId(sessionId);
        if (!booking) throw new Error("Booking not found");
        return await this._invoiceGenerator.generateInvoice(booking);
    }
}
