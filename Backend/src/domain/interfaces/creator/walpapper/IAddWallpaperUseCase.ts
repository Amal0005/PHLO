import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { WallpaperEntity } from "@/domain/entities/wallpaperEntity";

export interface IAddWallpaperUseCase {
    addWallpaper(data: Partial<WallpaperEntity>, imageBuffer: Buffer, contentType: string): Promise<WallpaperResponseDto>
}