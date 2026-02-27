import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IGetAllWallpapersUseCase } from "@/domain/interface/admin/wallpaper/IGetAllWallpapersUseCase";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export class GetAllWallpapersUseCase implements IGetAllWallpapersUseCase {
    constructor(private _wallpaperRepo: IWallpaperRepository) { }

    async getAllWallpapers(
        page: number,
        limit: number,
        status?: WallpaperStatus,
        search?: string,
    ): Promise<PaginatedResult<WallpaperEntity>> {
        return this._wallpaperRepo.findAllWallpapers(page, limit, status, search);
    }
}
