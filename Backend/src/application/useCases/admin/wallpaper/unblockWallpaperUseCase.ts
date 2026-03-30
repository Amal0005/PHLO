import type { IUnblockWallpaperUseCase } from "@/domain/interface/admin/wallpaper/IUnblockWallpaperUseCase";
import type { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class UnblockWallpaperUseCase implements IUnblockWallpaperUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository
    ) {}
    async unblockWallpaper(wallpaperId: string): Promise<void> {
        if (!wallpaperId) throw new Error(MESSAGES.WALLPAPER.ID_REQUIRED);
        const wallpaper = await this._wallpaperRepo.findById(wallpaperId)
        if (!wallpaper) throw new Error(MESSAGES.WALLPAPER.NOT_FOUND)
        // If unblocking, we typically restore it to approved if it was approved before.
        // For simplicity, we set it back to approved.
        await this._wallpaperRepo.updateStatus(wallpaperId, "approved")
    }
}
