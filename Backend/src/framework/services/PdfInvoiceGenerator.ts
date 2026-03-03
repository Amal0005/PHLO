import PDFDocument from "pdfkit";
import { IPdfInvoiceGenerator } from "@/domain/interface/services/IInvoiceGenerator";

export class PdfInvoiceGenerator implements IPdfInvoiceGenerator {
    async generateInvoice(booking: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const chunks: Buffer[] = [];
                doc.on("data", (chunk) => chunks.push(chunk));
                doc.on("end", () => resolve(Buffer.concat(chunks)));
                doc.on("error", (err) => reject(err));

                // Invoice Header
                doc.fontSize(25).text("PHLO", { align: "right" });
                doc.fontSize(10).text("Cinematic Photography Experience", { align: "right" });
                doc.moveDown();

                doc.fontSize(20).text("INVOICE", { align: "left" });
                doc.moveDown();

                // Booking Info
                const bookingId = (booking.id || booking._id || 'N/A').toString().toUpperCase();
                doc.fontSize(10).text(`Booking ID: ${bookingId}`);
                doc.text(`Reference: ${booking.stripeSessionId || "N/A"}`);
                doc.text(`Date: ${new Date().toLocaleDateString()}`);
                doc.moveDown();

                // Table Header
                const startY = doc.y;
                doc.text("Description", 50, startY);
                doc.text("Quantity", 300, startY);
                doc.text("Amount", 450, startY);
                doc.moveTo(50, startY + 15).lineTo(550, startY + 15).stroke();
                doc.moveDown();

                // Line Items
                const itemY = doc.y + 10;
                doc.text(booking.packageId?.title || "Photography Package", 50, itemY);
                doc.text("1", 300, itemY);
                doc.text(`₹${(booking.amount || 0).toLocaleString()}`, 450, itemY);

                doc.moveTo(50, itemY + 15).lineTo(550, itemY + 15).stroke();
                doc.moveDown(2);

                // Totals
                const totalY = doc.y;
                doc.fontSize(12).font("Helvetica-Bold").text("Total Amount", 300, totalY);
                doc.text(`₹${(booking.amount || 0).toLocaleString()}`, 450, totalY);

                doc.moveDown(4);
                doc.fontSize(10).font("Helvetica").fillColor("gray").text("Thank you for choosing PHLO for your creative session.", { align: "center" });
                doc.end();
            } catch (err) {
                reject(err);
            }
        });
    }
}
