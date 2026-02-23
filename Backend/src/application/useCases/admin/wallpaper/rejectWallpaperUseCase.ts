import { IRejectWallpaperUseCase } from "@/domain/interface/admin/wallpaper/IRejectWallpaperUseCase";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { MESSAGES } from "@/utils/commonMessages";

export class RejectWallpaperUseCase implements IRejectWallpaperUseCase{
    constructor(
        private _wallpaperRepo:IWallpaperRepository
    ){}
    async rejectWallpaper(wallpaperId: string, reason: string): Promise<void> {
        if(!wallpaperId)throw new Error(MESSAGES.WALLPAPER.ID_REQUIRED)
            if(!reason)throw new Error(MESSAGES.WALLPAPER.REJECTION_REASON_REQUIRED)
                const wallpaper=await this._wallpaperRepo.findById(wallpaperId)
            if(!wallpaper)throw new Error(MESSAGES.WALLPAPER.NOT_FOUND)
                await this._wallpaperRepo.updateStatus(wallpaperId,"rejected",reason)
    }
}