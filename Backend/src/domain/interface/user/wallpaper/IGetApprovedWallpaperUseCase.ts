import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetApprovedWallpapersUseCase {
  getApprovedWallpapers(page: number,limit: number,search?: string): Promise<PaginatedResult<WallpaperEntity>>;
}
