export interface IApproveWallpaperUseCase {
  approveWallpaper(wallpaperId: string): Promise<void>;
}
