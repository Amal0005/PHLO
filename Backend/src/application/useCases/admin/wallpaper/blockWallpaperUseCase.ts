import type { IBlockWallpaperUseCase } from "@/domain/interfaces/admin/wallpaper/IBlockWallpaperUseCase";
import type { IWallpaperRepository } from "@/domain/interfaces/repository/IWallpaperRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class BlockWallpaperUseCase implements IBlockWallpaperUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository
    ) {}
    async blockWallpaper(wallpaperId: string): Promise<void> {
        if (!wallpaperId) throw new Error(MESSAGES.WALLPAPER.ID_REQUIRED);
        const wallpaper = await this._wallpaperRepo.findById(wallpaperId)
        if (!wallpaper) throw new Error(MESSAGES.WALLPAPER.NOT_FOUND)
        await this._wallpaperRepo.updateStatus(wallpaperId, "blocked")
    }
}
