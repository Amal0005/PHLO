import type { IDashboardStatsUseCase } from "@/domain/interfaces/admin/IDashboardStatsUseCase";
import type { IDashboardReportGenerator } from "@/domain/interfaces/service/IReportGenerator";
import type { IGenerateDashboardReportUseCase } from "@/domain/interfaces/admin/IGenerateDashboardReportUseCase";

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
