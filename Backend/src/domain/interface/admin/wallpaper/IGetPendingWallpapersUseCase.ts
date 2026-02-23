import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetPendingWallpapersUseCase {
  getPendingWallpapers(page: number,limit: number): Promise<PaginatedResult<WallpaperEntity>>;
}
