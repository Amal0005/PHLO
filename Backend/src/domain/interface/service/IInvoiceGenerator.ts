import type { BookingEntity } from "@/domain/entities/bookingEntity";

export interface IPdfInvoiceGenerator {
    generateInvoice(bookingData: BookingEntity): Promise<Buffer>;
}
