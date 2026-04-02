import type { IRecordDownloadUseCase } from "@/domain/interfaces/creator/walpapper/IRecordDownloadUseCase";
import type { IWallpaperDownloadRepository } from "@/domain/interfaces/repository/IWallpaperDownloadRepository";
import type { IWallpaperRepository } from "@/domain/interfaces/repository/IWallpaperRepository";

export class RecordDownloadUseCase implements IRecordDownloadUseCase {
    constructor(
        private _wallpaperDownloadRepo: IWallpaperDownloadRepository,
        private _wallpaperRepo: IWallpaperRepository
    ) {}
    async record(wallpaperId: string, userId: string, creatorId: string): Promise<{ downloadCount: number; }> {
        if (!wallpaperId) throw new Error("wallpaper id required");
        if (!userId) throw new Error("User id required");
        if (!creatorId) throw new Error("Creator id required");

        const wallpaper = await this._wallpaperRepo.findById(wallpaperId);
        if (!wallpaper) throw new Error("Wallpaper not found");

        if (wallpaper.price > 0) {
            const purchased = await this._wallpaperDownloadRepo.hasPurchased(wallpaperId, userId);
            if (!purchased) {
                throw new Error("You must purchase this wallpaper before downloading.");
            }
        }

        await this._wallpaperDownloadRepo.recordDownload(wallpaperId, userId, creatorId)
        const downloadCount = await this._wallpaperDownloadRepo.getDownloadCount(wallpaperId)
        return { downloadCount }
    }
}