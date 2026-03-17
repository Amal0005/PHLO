import { Request, Response } from "express";
import { IDashboardStatsUseCase } from "@/domain/interface/admin/IDashboardStatsUseCase";
import { StatusCode } from "@/constants/statusCodes";

export class AdminDashboardController {
  constructor(private _statsUseCase: IDashboardStatsUseCase) {}

  async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await this._statsUseCase.getStats();
      return res.status(StatusCode.OK).json({ success: true, result: stats });
    } catch (error: unknown) {
      console.error("Dashboard Stats Fetch Error:", error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Failed to fetch dashboard statistics" 
      });
    }
  }
}
