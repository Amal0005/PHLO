import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { IGetPendingWallpapersUseCase } from "@/domain/interface/admin/wallpaper/IGetPendingWallpapersUseCase";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetPendingWallpapersUseCase implements IGetPendingWallpapersUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository
    ) {}
    async getPendingWallpapers(page: number, limit: number): Promise<PaginatedResult<WallpaperResponseDto>> {
        const result = await this._wallpaperRepo.findByStatus("pending", page, limit);
        return {
            ...result,
            data: result.data.map(wp => WallpaperMapper.toDto(wp))
        };
    }
}