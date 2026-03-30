import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { IWallpaperDownloadRepository } from "@/domain/interface/repository/IWallpaperDownloadRepository";
import type { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import type { IGetApprovedWallpapersUseCase } from "@/domain/interface/user/wallpaper/IGetApprovedWallpaperUseCase";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetApprovedWallpaperUseCase implements IGetApprovedWallpapersUseCase {
    constructor(
        private _wallpaperRepo: IWallpaperRepository,
        private _wallpaperDownloadRepo: IWallpaperDownloadRepository
    ) {}
    async getApprovedWallpapers(
        page: number,
        limit: number,
        search?: string,
        hashtag?: string,
        minPrice?: number,
        maxPrice?: number,
        userId?: string,
        ids?: string[]
    ): Promise<PaginatedResult<WallpaperResponseDto>> {
        const result = await this._wallpaperRepo.findApproved(page, limit, search, hashtag, minPrice, maxPrice, ids);

        const enrichedData = await Promise.all(result.data.map(async (wp) => {
            const isPurchased = userId ? (wp.price === 0 || await this._wallpaperDownloadRepo.hasPurchased(wp._id!, userId)) : false;
            return WallpaperMapper.toDto({ ...wp, isPurchased });
        }));

        return { ...result, data: enrichedData };
    }
}