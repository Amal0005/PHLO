import type { Request, Response } from "express";
import type { IDashboardStatsUseCase } from "@/domain/interfaces/admin/IDashboardStatsUseCase";
import type { IGenerateDashboardReportUseCase } from "@/domain/interfaces/admin/IGenerateDashboardReportUseCase";
import { StatusCode } from "@/constants/statusCodes";

export class AdminDashboardController {
  constructor(
    private _statsUseCase: IDashboardStatsUseCase,
    private _reportUseCase: IGenerateDashboardReportUseCase,
  ) {}

  async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const timeframe = String(req.query.timeframe || "monthly");
      const stats = await this._statsUseCase.getStats(timeframe);
      return res.status(StatusCode.OK).json({ success: true, result: stats });
    } catch (error: unknown) {
      console.error("Dashboard Stats Fetch Error:", error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
      });
    }
  }

  async downloadReport(req: Request, res: Response): Promise<void> {
    try {
      const timeframe = String(req.query.timeframe || "monthly");
      const pdfBuffer = await this._reportUseCase.generateReport(timeframe);

      const filename = `PHLO_Dashboard_Report_${timeframe}_${new Date().toISOString().split("T")[0]}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.status(StatusCode.OK).send(pdfBuffer);
    } catch (error: unknown) {
      console.error("Dashboard Report Download Error Detail:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to generate dashboard report",
      });
    }
  }
}
