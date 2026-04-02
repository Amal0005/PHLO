export interface IWatermarkService {
    generateWatermark(originalBuffer: Buffer, originalS3Key: string): Promise<string>;
}
