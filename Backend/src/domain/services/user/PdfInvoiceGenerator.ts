import PDFDocument from "pdfkit";
import type { BookingEntity } from "@/domain/entities/bookingEntity";
import type { IPdfInvoiceGenerator } from "@/domain/interfaces/service/IInvoiceGenerator";

import type { User } from "@/domain/entities/userEntities";
import type { PackageEntity } from "@/domain/entities/packageEntity";

export class PdfInvoiceGenerator implements IPdfInvoiceGenerator {
    async generateInvoice(booking: BookingEntity): Promise<Buffer> {
        const user = booking.userId as User;
        const pkg = booking.packageId as PackageEntity;
        const amount = booking.amount || 0;
        
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks: Buffer[] = [];
                doc.on("data", (chunk) => chunks.push(chunk));
                doc.on("end", () => resolve(Buffer.concat(chunks)));
                doc.on("error", (err) => reject(err));

                // --- HEADER ---
                doc.fontSize(25).font("Helvetica-Bold").text("PHLO", { align: "right" });
                doc.fontSize(10).font("Helvetica").fillColor("gray").text("Cinematic Photography Experience", { align: "right" });
                doc.moveDown(2);

                // --- INVOICE TITLE & INFO ---
                const startY = doc.y;
                doc.fontSize(20).font("Helvetica-Bold").fillColor("black").text("INVOICE", 50, startY);
                
                doc.fontSize(10).font("Helvetica-Bold").text("Billed To:", 50, startY + 40);
                doc.font("Helvetica").text(user?.name || "Valued Customer", 50, startY + 55);
                doc.text(user?.email || "", 50, startY + 70);
                if (user?.phone) doc.text(user.phone, 50, startY + 85);

                doc.font("Helvetica-Bold").text("Invoice Details:", 350, startY + 40);
                doc.font("Helvetica").text(`Invoice ID: ${booking.id?.toString().toUpperCase() || "N/A"}`, 350, startY + 55);
                doc.text(`Reference: ${booking.stripeSessionId || "N/A"}`, 350, startY + 70);
                doc.text(`Date: ${new Date(booking.bookingDate || new Date()).toLocaleDateString()}`, 350, startY + 85);
                
                doc.moveDown(5);

                // --- TABLE HEADER ---
                const tableY = doc.y + 20;
                doc.fontSize(10).font("Helvetica-Bold").text("Item Description", 50, tableY);
                doc.text("Qty", 350, tableY, { width: 50, align: "center" });
                doc.text("Total Price", 450, tableY, { width: 100, align: "right" });
                
                doc.moveTo(50, tableY + 15).lineTo(550, tableY + 15).strokeColor("#eeeeee").stroke();
                
                // --- ITEM ROW ---
                const rowY = tableY + 30;
                doc.font("Helvetica").text(pkg?.title || "Professional Photography Session", 50, rowY, { width: 250 });
                doc.text("1", 350, rowY, { width: 50, align: "center" });
                doc.text(`₹${amount.toLocaleString()}`, 450, rowY, { width: 100, align: "right" });
                
                doc.moveTo(50, rowY + 25).lineTo(550, rowY + 25).strokeColor("#eeeeee").stroke();
                doc.moveDown(3);

                // --- TOTALS ---
                const footerY = doc.y;
                doc.fontSize(12).font("Helvetica-Bold").text("Amount Due:", 350, footerY);
                doc.fontSize(12).text(`₹${amount.toLocaleString()}`, 450, footerY, { width: 100, align: "right" });

                // --- FOOTER ---
                doc.moveTo(50, 700).lineTo(550, 700).strokeColor("#eeeeee").stroke();
                doc.moveDown(4);
                doc.fontSize(10).font("Helvetica").fillColor("gray").text("Thank you for choosing PHLO for your creative session.", 50, 720, { align: "center" });
                doc.text("For any inquiries, contact hello@phlo.website", 50, 735, { align: "center" });

                doc.end();
            } catch (err) {
                reject(err);
            }
        });
    }
}
