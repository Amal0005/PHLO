import type { IDashboardStats } from "@/domain/interface/admin/IDashboardStatsUseCase";

export interface IDashboardReportGenerator {
  generateReport(stats: IDashboardStats, timeframe: string): Promise<Buffer>;
}
