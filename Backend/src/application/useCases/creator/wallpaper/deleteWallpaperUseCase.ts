import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import type { IDeleteWallpaperUseCase } from "@/domain/interface/creator/walpapper/IDeleteWallpaperUseCase";
import type { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class DeleteWallpaperUseCase implements IDeleteWallpaperUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository,
    ) {}
    async deleteWallpaper(wallpaperId: string, creatorId: string): Promise<void> {
        console.log("jvhjk", wallpaperId, creatorId)
        if (!creatorId) throw new Error("Creator Id is Required")
        const wallpaper = await this._wallpaperRepo.findById(wallpaperId)
        console.log("wallll", wallpaper)
        if (!wallpaper) throw new Error(MESSAGES.WALLPAPER.NOT_FOUND);
        const { _id: id } = wallpaper.creatorId as CreatorEntity;

        if (id && id.toString() !== creatorId.toString()) {
            throw new Error("You can only delete your own wallpapers");
        }
        const deleted = await this._wallpaperRepo.delete(wallpaperId)
        if (!deleted) throw new Error("Failed To Delete")
    }

} 