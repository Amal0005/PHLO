export interface IRejectWallpaperUseCase {
  rejectWallpaper(wallpaperId: string, reason: string): Promise<void>;
}
