export interface IWallpaperDownloadRepository {
      recordDownload(wallpaperId: string, userId: string, creatorId: string): Promise<boolean>
      getDownloadCount(wallpaperId:string):Promise<number>
}