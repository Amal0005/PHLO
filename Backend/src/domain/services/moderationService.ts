import vision from "@google-cloud/vision";
import type { IModerationService } from "@/domain/interface/service/IModerationService";

export class ModerationService implements IModerationService {
  private client = new vision.ImageAnnotatorClient();

  async checkImage(imageBuffer: Buffer): Promise<"SAFE" | "UNSAFE" | "UNCERTAIN"> {
    try {
      console.log("Moderating image via Google Cloud Vision content detection");
      
      const [result] = await this.client.safeSearchDetection({
        image: { content: imageBuffer }
      });

      const detections = result.safeSearchAnnotation;
      
      if (!detections) {
        console.warn("No safeSearchAnnotation results from Google Vision");
        return "UNCERTAIN";
      }

      console.log("SafeSearch Detections:", detections);

      // Define what counts as UNSAFE. 
      // Typically LIKELY or VERY_LIKELY for adult, violence, or racy content.
      const unsafeLevels = ["LIKELY", "VERY_LIKELY"];
      
      const isUnsafe = 
        unsafeLevels.includes(String(detections.adult)) || 
        unsafeLevels.includes(String(detections.violence)) || 
        unsafeLevels.includes(String(detections.racy)) ||
        unsafeLevels.includes(String(detections.medical));

      if (isUnsafe) {
        console.log("Content flagged as UNSAFE by Google Vision");
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