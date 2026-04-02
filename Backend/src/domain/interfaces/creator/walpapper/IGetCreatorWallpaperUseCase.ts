import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { WallpaperStatus } from "@/constants/wallpaperStatus";

export interface IGetCreatorWallpapersUseCase {
  getWallpapers(creatorId: string, page: number, limit: number, search?: string, status?: WallpaperStatus): Promise<PaginatedResult<WallpaperResponseDto>>;
}
