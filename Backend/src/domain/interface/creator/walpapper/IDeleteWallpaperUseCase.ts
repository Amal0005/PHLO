export interface IDeleteWallpaperUseCase {
  deleteWallpaper(wallpaperId: string, creatorId: string): Promise<void>;
}
