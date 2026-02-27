import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export interface IGetAllWallpapersUseCase {
    getAllWallpapers(page: number, limit: number, status?: WallpaperStatus, search?: string): Promise<PaginatedResult<WallpaperEntity>>;
}
