import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetPendingWallpapersUseCase {
  getPendingWallpapers(page: number, limit: number): Promise<PaginatedResult<WallpaperResponseDto>>;
}
