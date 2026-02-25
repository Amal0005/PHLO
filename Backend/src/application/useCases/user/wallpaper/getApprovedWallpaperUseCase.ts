import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { IGetApprovedWallpapersUseCase } from "@/domain/interface/user/wallpaper/IGetApprovedWallpaperUseCase";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetApprovedWallpaperUseCase implements IGetApprovedWallpapersUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository
    ) { }
    async getApprovedWallpapers(page: number, limit: number, search?: string, hashtag?: string, minPrice?: number, maxPrice?: number): Promise<PaginatedResult<WallpaperEntity>> {
        return await this._wallpaperRepo.findApproved(page, limit, search, hashtag, minPrice, maxPrice)
    }
}