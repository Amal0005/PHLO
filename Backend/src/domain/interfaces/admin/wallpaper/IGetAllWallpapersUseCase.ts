import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { WallpaperStatus } from "@/constants/wallpaperStatus";

export interface IGetAllWallpapersUseCase {
    getAllWallpapers(page: number, limit: number, status?: WallpaperStatus, search?: string): Promise<PaginatedResult<WallpaperResponseDto>>;
}
