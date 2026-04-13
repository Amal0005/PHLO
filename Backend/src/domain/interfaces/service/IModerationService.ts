export interface ModerationResult {
  status: "SAFE" | "UNSAFE" | "UNCERTAIN";
  reason?: string;
}

export interface IModerationService {
  checkImage(imageBuffer: Buffer): Promise<ModerationResult>;
}