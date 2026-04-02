import type { IDashboardStats } from "@/domain/interfaces/admin/IDashboardStatsUseCase";

export interface IDashboardReportGenerator {
  generateReport(stats: IDashboardStats, timeframe: string): Promise<Buffer>;
}
