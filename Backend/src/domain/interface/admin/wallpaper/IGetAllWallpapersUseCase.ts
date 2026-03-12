import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/constants/wallpaperStatus";

export interface IGetAllWallpapersUseCase {
    getAllWallpapers(page: number, limit: number, status?: WallpaperStatus, search?: string): Promise<PaginatedResult<WallpaperResponseDto>>;
}
