export interface IRecordDownloadUseCase {
  record(wallpaperId: string, userId: string, creatorId: string): Promise<{ downloadCount: number }>;
}