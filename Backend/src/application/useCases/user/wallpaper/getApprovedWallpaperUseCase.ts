import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { IGetApprovedWallpapersUseCase } from "@/domain/interface/user/wallpaper/IGetApprovedWallpaperUseCase";
import { IWallpaperDownloadRepository } from "@/domain/interface/repositories/IWallpaperDownloadRepository ";
import { PaginatedResult } from "@/domain/types/paginationTypes";

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
        userId?: string
    ): Promise<PaginatedResult<WallpaperEntity & { isPurchased?: boolean }>> {
        const result = await this._wallpaperRepo.findApproved(page, limit, search, hashtag, minPrice, maxPrice);

        if (userId) {
            const enrichedData = await Promise.all(result.data.map(async (wp) => {
                const isPurchased = wp.price === 0 || await this._wallpaperDownloadRepo.hasPurchased(wp._id!, userId);
                return { ...wp, isPurchased };
            }));
            return { ...result, data: enrichedData };
        }

        return result;
    }
}