export interface IWatermarkService {
    generateWatermark(originalS3Key: string): Promise<string>;
}
