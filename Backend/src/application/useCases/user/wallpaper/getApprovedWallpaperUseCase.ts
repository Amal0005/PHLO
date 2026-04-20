import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { IWallpaperDownloadRepository } from "@/domain/interfaces/repository/IWallpaperDownloadRepository";
import type { IWallpaperRepository } from "@/domain/interfaces/repository/IWallpaperRepository";
import type { IGetApprovedWallpapersUseCase } from "@/domain/interfaces/user/wallpaper/IGetApprovedWallpaperUseCase";
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
        creatorId?: string,
        userId?: string,
        ids?: string[],
        purchasedOnly?: boolean
    ): Promise<PaginatedResult<WallpaperResponseDto>> {
        let effectiveIds = ids;

        if (purchasedOnly) {
            if (!userId) {
                return {
                    data: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                };
            }

            const purchasedIds = await this._wallpaperDownloadRepo.getPurchasedWallpaperIds(userId);
            if (purchasedIds.length === 0) {
                return {
                    data: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                };
            }

            effectiveIds = effectiveIds?.length
                ? effectiveIds.filter((id) => purchasedIds.includes(id))
                : purchasedIds;

            if (!effectiveIds.length) {
                return {
                    data: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                };
            }
        }

        const result = await this._wallpaperRepo.findApproved(page, limit, search, hashtag, minPrice, maxPrice, effectiveIds, creatorId);

        const enrichedData = await Promise.all(result.data.map(async (wp) => {
            const isPurchased = userId ? (wp.price === 0 || await this._wallpaperDownloadRepo.hasPurchased(wp._id!, userId)) : false;
            return WallpaperMapper.toDto({ ...wp, isPurchased });
        }));

        return { ...result, data: enrichedData };
    }
}