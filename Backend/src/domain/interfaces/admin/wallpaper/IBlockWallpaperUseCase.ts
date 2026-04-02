export interface IBlockWallpaperUseCase {
  blockWallpaper(wallpaperId: string): Promise<void>;
}
