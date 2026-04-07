import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetApprovedWallpapersUseCase {
  getApprovedWallpapers(
    page: number,
    limit: number,
    search?: string,
    hashtag?: string,
    minPrice?: number,
    maxPrice?: number,
    creatorId?: string,
    userId?: string,
    ids?: string[]
  ): Promise<PaginatedResult<WallpaperResponseDto>>;
}
