export interface IUnblockWallpaperUseCase {
  unblockWallpaper(wallpaperId: string): Promise<void>;
}
