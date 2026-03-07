import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";

export interface IAddWallpaperUseCase {
    addWallpaper(data: Partial<WallpaperEntity>): Promise<WallpaperResponseDto>
}