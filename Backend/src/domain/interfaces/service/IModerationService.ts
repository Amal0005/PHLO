export interface IModerationService {
  checkImage(imageBuffer: Buffer): Promise<"SAFE" | "UNSAFE" | "UNCERTAIN">;
}