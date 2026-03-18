import { IApproveWallpaperUseCase } from "@/domain/interface/admin/wallpaper/IApproveWallpaperUseCase";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class ApproveWallpaperUseCase implements IApproveWallpaperUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository
    ) {}
    async approveWallpaper(wallpaperId: string): Promise<void> {
        if (!wallpaperId) throw new Error(MESSAGES.WALLPAPER.ID_REQUIRED);
        const wallpaper = await this._wallpaperRepo.findById(wallpaperId)
        if (!wallpaper) throw new Error(MESSAGES.WALLPAPER.NOT_FOUND)
        await this._wallpaperRepo.updateStatus(wallpaperId, "approved")
    }
}