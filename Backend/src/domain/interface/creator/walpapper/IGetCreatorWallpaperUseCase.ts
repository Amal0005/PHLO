import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export interface IGetCreatorWallpapersUseCase {
  getWallpapers(creatorId: string, page: number, limit: number, search?: string, status?: WallpaperStatus): Promise<PaginatedResult<WallpaperResponseDto>>;
}
