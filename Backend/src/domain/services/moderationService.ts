import vision from "@google-cloud/vision";
import type { IModerationService } from "@/domain/interfaces/service/IModerationService";

export class ModerationService implements IModerationService {
  private client = new vision.ImageAnnotatorClient({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON as string)
  })
  async checkImage(imageBuffer: Buffer): Promise<"SAFE" | "UNSAFE" | "UNCERTAIN"> {
    try {
      
      const [result] = await this.client.safeSearchDetection({
        image: { content: imageBuffer }
      });

      const detections = result.safeSearchAnnotation;
      
      if (!detections) {
        return "UNCERTAIN";
      }

      const unsafeLevels = ["LIKELY", "VERY_LIKELY"];
      
      const isUnsafe = 
        unsafeLevels.includes(String(detections.adult)) || 
        unsafeLevels.includes(String(detections.violence)) || 
        unsafeLevels.includes(String(detections.racy)) ||
        unsafeLevels.includes(String(detections.medical));

      if (isUnsafe) {
        return "UNSAFE";
      }

      return "SAFE";
    } catch (error: unknown) {
      console.error("Google Cloud Vision Error:", error);
      if ((error as { code?: number }).code === 7) {
        console.error("HINT: This usually means billing is not enabled or propagation is still in progress.");
      }
      return "UNCERTAIN";
    }
  }
}
