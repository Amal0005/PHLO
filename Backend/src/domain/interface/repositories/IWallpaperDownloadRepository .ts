export interface IWallpaperDownloadRepository {
      recordDownload(wallpaperId: string, userId: string, creatorId: string): Promise<boolean>
      getDownloadCount(wallpaperId: string): Promise<number>
      hasPurchased(wallpaperId: string, userId: string): Promise<boolean>
}