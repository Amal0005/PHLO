import { IRecordDownloadUseCase } from "@/domain/interface/creator/walpapper/IRecordDownloadUseCase";
import { IWallpaperDownloadRepository } from "@/domain/interface/repositories/IWallpaperDownloadRepository ";

export class RecordDownloadUseCase implements IRecordDownloadUseCase {
    constructor(
        private _wallpaperDownloadRepo: IWallpaperDownloadRepository
    ) {}
    async record(wallpaperId: string, userId: string, creatorId: string): Promise<{ downloadCount: number; }> {
        if (!wallpaperId) throw new Error("wallpaper id required");
        if (!userId) throw new Error("User id required");
        if (!creatorId) throw new Error("Creator id required");

        await this._wallpaperDownloadRepo.recordDownload(wallpaperId, userId, creatorId)
        const downloadCount = await this._wallpaperDownloadRepo.getDownloadCount(wallpaperId)
        return {downloadCount}
    }
}