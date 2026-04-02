export interface IGenerateDashboardReportUseCase {
  generateReport(timeframe: string): Promise<Buffer>;
}
