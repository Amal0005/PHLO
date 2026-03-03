export interface IPdfInvoiceGenerator {
    generateInvoice(bookingData: any): Promise<Buffer>;
}
