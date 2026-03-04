export interface IPdfInvoiceGenerator {
    generateInvoice(bookingData: Record<string, unknown>): Promise<Buffer>;
}
