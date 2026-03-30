import type { IDashboardStatsUseCase } from "@/domain/interface/admin/IDashboardStatsUseCase";
import type { IDashboardReportGenerator } from "@/domain/interface/service/IReportGenerator";
import type { IGenerateDashboardReportUseCase } from "@/domain/interface/admin/IGenerateDashboardReportUseCase";

export class GenerateDashboardReportUseCase implements IGenerateDashboardReportUseCase {
    constructor(
        private _statsUseCase: IDashboardStatsUseCase,
        private _reportGenerator: IDashboardReportGenerator
    ) {}

    async generateReport(timeframe: string = "monthly"): Promise<Buffer> {
        const stats = await this._statsUseCase.getStats(timeframe);
        return await this._reportGenerator.generateReport(stats, timeframe);
    }
}
