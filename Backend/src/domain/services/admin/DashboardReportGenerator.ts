import PDFDocument from "pdfkit";
import { IDashboardStats } from "@/domain/interface/admin/IDashboardStatsUseCase";
import { IDashboardReportGenerator } from "@/domain/interface/service/IReportGenerator";
import path from "node:path";
import fs from "fs";

export class DashboardReportGenerator implements IDashboardReportGenerator {
  async generateReport(stats: IDashboardStats, timeframe: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => {
          console.error("PDF Generation Error (doc.on.error):", err);
          reject(err);
        });

        console.log("Generating dashboard report for timeframe:", timeframe);

        // Header Background
        doc.rect(0, 0, doc.page.width, 140).fill("#050505");

        // Logo
        const logoPath = path.join(process.cwd(), "public", "Logo_white.png");
        if (fs.existsSync(logoPath)) {
          try {
            doc.image(logoPath, 50, 40, { height: 60 });
          } catch (imgError) {
            console.error("PDF Logo Image Error:", imgError);
          }
        }

        doc.fillColor("#ffffff");
        doc.fontSize(22).font("Helvetica-Bold").text("ADMIN ANALYTICS", 250, 50, { align: "right" });
        doc.fontSize(10).font("Helvetica").text("SYSTEM GENERATED EXPORT", 250, 80, { align: "right" });
        doc.fontSize(8).font("Helvetica").text(`TIMEFRAME: ${timeframe.toUpperCase()} ANALYSIS / ${new Date().toLocaleDateString()}`, 250, 100, { align: "right" });
        
        doc.moveDown(4);
        doc.fillColor("#050505"); // Reset text color

        // Summary Cards
        const cardWidth = 160;
        const cardHeight = 80;
        const startX = 50;
        let currentY = 160;

        const summaryData = [
          { label: "GROSS REVENUE", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: "#3b82f6" },
          { label: "ACTIVE USERS", value: (stats.totalUsers || 0).toString(), color: "#8b5cf6" },
          { label: "TOTAL BOOKINGS", value: (stats.totalBookings || 0).toString(), color: "#f97316" },
        ];

        summaryData.forEach((stat, i) => {
          const x = startX + (i * (cardWidth + 15));
          doc.rect(x, currentY, cardWidth, cardHeight).lineWidth(0.5).stroke("#eeeeee");
          doc.fontSize(8).font("Helvetica-Bold").fillColor("#666666").text(stat.label, x + 15, currentY + 20);
          doc.fontSize(18).font("Helvetica-Bold").fillColor(stat.color).text(stat.value, x + 15, currentY + 40);
        });

        currentY += cardHeight + 40;

        // Revenue Velocity Chart (Text representation)
        doc.fontSize(14).font("Helvetica-Bold").fillColor("#050505").text(`${timeframe.toUpperCase()} REVENUE VELOCITY`, 50, currentY);
        doc.moveDown(1);
        
        const chartY = doc.y;
        doc.fontSize(10).font("Helvetica");
        if (stats.revenueData && stats.revenueData.length > 0) {
          stats.revenueData.forEach((item, i) => {
              const rowY = chartY + (i * 20);
              doc.fillColor("#444444").text(item.label, 50, rowY);
              const maxRevenue = Math.max(...stats.revenueData.map(d => d.amount)) || 1;
              doc.rect(120, rowY - 2, 350 * (item.amount / maxRevenue), 10).fill("#3b82f6");
              doc.fillColor("#050505").font("Helvetica-Bold").text(`₹${item.amount.toLocaleString()}`, 480, rowY);
          });
          currentY = chartY + (stats.revenueData.length * 20) + 40;
        } else {
          doc.fontSize(10).font("Helvetica").text("NO REVENUE DATA DETECTED FOR THIS PERIOD", 50, chartY);
          currentY = chartY + 40;
        }

        // Transaction Ledger
        if (currentY > 650) { doc.addPage(); currentY = 50; }
        
        doc.fontSize(14).font("Helvetica-Bold").text("SYSTEM LEDGER ACTIVITY", 50, currentY);
        doc.moveDown(1);

        const tableTop = doc.y;
        doc.fontSize(9).font("Helvetica-Bold").fillColor("#666666");
        doc.text("ORIGIN", 50, tableTop);
        doc.text("RECORD DESCRIPTION", 130, tableTop);
        doc.text("TYPE", 410, tableTop);
        doc.text("DELTA", 480, tableTop, { align: "right" });
        
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).lineWidth(0.5).stroke("#eeeeee");
        
        currentY = tableTop + 25;
        doc.font("Helvetica").fontSize(8).fillColor("#050505");
        
        if (stats.recentTransactions && stats.recentTransactions.length > 0) {
          stats.recentTransactions.forEach(tx => {
            if (currentY > 750) {
              doc.addPage();
              currentY = 50;
              doc.fontSize(9).font("Helvetica-Bold").fillColor("#666666");
              doc.text("ORIGIN", 50, currentY);
              doc.text("RECORD DESCRIPTION", 130, currentY);
              doc.text("TYPE", 410, currentY);
              doc.text("DELTA", 480, currentY, { align: "right" });
              currentY += 20;
            }
            doc.fillColor("#3b82f6").text((tx.source || "N/A").toUpperCase(), 50, currentY);
            doc.fillColor("#050505").text((tx.description || "N/A").toUpperCase().substring(0, 50), 130, currentY);
            doc.text((tx.type || "N/A").toUpperCase(), 410, currentY);
            
            const deltaColor = tx.type === 'credit' ? '#10b981' : '#f43f5e';
            doc.fillColor(deltaColor).font("Helvetica-Bold").text(`${tx.type === 'credit' ? '+' : '-'}₹${(tx.amount || 0).toLocaleString()}`, 480, currentY, { align: "right" });
            
            doc.font("Helvetica").fontSize(7).fillColor("#999999").text(new Date(tx.timestamp || Date.now()).toLocaleString(), 130, currentY + 10);
            
            currentY += 30;
          });
        } else {
          doc.fontSize(10).font("Helvetica").text("NO RECENT TRANSACTIONS DETECTED", 50, currentY);
          currentY += 30;
        }

        // Distribution Charts
        if (currentY > 600) { doc.addPage(); currentY = 50; } else { currentY += 20; }
        
        doc.fontSize(14).font("Helvetica-Bold").fillColor("#050505").text("DISTRIBUTION METRICS", 50, currentY);
        currentY += 30;

        const leftColX = 50;
        const rightColX = 300;
        
        // Status Distribution
        doc.fontSize(10).font("Helvetica-Bold").text("BOOKING STATUS", leftColX, currentY);
        let statusY = currentY + 20;
        stats.bookingStatusStats.forEach(stat => {
            doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${stat.status.toUpperCase()}:`, leftColX, statusY);
            doc.font("Helvetica-Bold").fillColor("#050505").text(stat.count.toString(), leftColX + 100, statusY);
            statusY += 15;
        });

        // Global Health
        doc.fontSize(10).font("Helvetica-Bold").text("GLOBAL HEALTH", rightColX, currentY);
        let healthY = currentY + 20;
        const healthMetrics = [
            { label: "TOTAL WALLPAPERS", value: stats.totalWallpapers },
            { label: "ACTIVE PACKAGES", value: stats.totalPackages },
            { label: "TOTAL COMPLAINTS", value: stats.totalComplaints }
        ];
        healthMetrics.forEach(metric => {
            doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${metric.label}:`, rightColX, healthY);
            doc.font("Helvetica-Bold").fillColor("#050505").text(metric.value.toString(), rightColX + 150, healthY);
            healthY += 15;
        });

        // Footer
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc.fontSize(7).font("Helvetica").fillColor("#999999")
            .text(`PHLO ADVANCED INTELLIGENCE CORE V3.0.0-PRO / SYSTEM OVERLOOK / PAGE ${i + 1} OF ${pageCount}`, 
                  50, 780, { align: "center" });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
