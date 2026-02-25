import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export interface IGetCreatorWallpapersUseCase {
  getWallpapers(creatorId: string, page: number, limit: number, search?: string, status?: WallpaperStatus): Promise<PaginatedResult<WallpaperEntity>>;
}
