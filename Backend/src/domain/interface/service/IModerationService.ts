export interface IModerationService {
  checkImage(imageBuffer: Buffer, title?: string, hashtags?: string[]): Promise<"SAFE" | "UNSAFE" | "UNCERTAIN">;
}