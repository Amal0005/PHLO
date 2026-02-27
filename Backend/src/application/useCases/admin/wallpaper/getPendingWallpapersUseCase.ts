import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IGetPendingWallpapersUseCase } from "@/domain/interface/admin/wallpaper/IGetPendingWallpapersUseCase";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetPendingWallpapersUseCase implements IGetPendingWallpapersUseCase{
    constructor(
        private _wallpaperRepo:IWallpaperRepository
    ){}
    async getPendingWallpapers(page: number, limit: number): Promise<PaginatedResult<WallpaperEntity>> {
        return this._wallpaperRepo.findByStatus("pending",page,limit)
    }
}