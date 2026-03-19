import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { IGetAllWallpapersUseCase } from "@/domain/interface/admin/wallpaper/IGetAllWallpapersUseCase";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/constants/wallpaperStatus";

export class GetAllWallpapersUseCase implements IGetAllWallpapersUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository
    ) {}

    async getAllWallpapers(
        page: number,
        limit: number,
        status?: WallpaperStatus,
        search?: string,
    ): Promise<PaginatedResult<WallpaperResponseDto>> {
        const result = await this._wallpaperRepo.findAllWallpapers(page, limit, status, search);
        return {
            ...result,
            data: result.data.map(wp => WallpaperMapper.toDto(wp))
        };
    }
}
