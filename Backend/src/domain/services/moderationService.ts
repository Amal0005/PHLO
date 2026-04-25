import vision from "@google-cloud/vision";
import type { IModerationService, ModerationResult } from "@/domain/interfaces/service/IModerationService";
import fs from "fs";
import path from "path";

export class ModerationService implements IModerationService {
  private client = new vision.ImageAnnotatorClient({
    credentials: JSON.parse(
      fs.readFileSync(
        path.resolve(process.env.GOOGLE_CREDENTIALS_JSON as string),
        "utf-8"
      )
    )
  })
  // private client = new vision.ImageAnnotatorClient({
  //   credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON as string)
  // })
  async checkImage(imageBuffer: Buffer): Promise<ModerationResult> {
    try {
      const [result] = await this.client.safeSearchDetection({
        image: { content: imageBuffer }
      });

      const detections = result.safeSearchAnnotation;

      if (!detections) {
        return { status: "UNCERTAIN" };
      }

      const unsafeLevels = ["LIKELY", "VERY_LIKELY"];
      const violations: string[] = [];

      if (unsafeLevels.includes(String(detections.adult))) violations.push("Adult Content");
      if (unsafeLevels.includes(String(detections.violence))) violations.push("Violent Content");
      if (unsafeLevels.includes(String(detections.racy))) violations.push("Racy Content");
      if (unsafeLevels.includes(String(detections.medical))) violations.push("Medical/Sensitive Content");
      if (unsafeLevels.includes(String(detections.spoof))) violations.push("Spoof/Misleading Content");

      if (violations.length > 0) {
        return {
          status: "UNSAFE",
          reason: `Image violates community standards: ${violations.join(", ")}`
        };
      }

      return { status: "SAFE" };
    } catch (error: unknown) {
      console.error("Google Cloud Vision Error:", error);
      if ((error as { code?: number }).code === 7) {
        console.error("HINT: This usually means billing is not enabled or propagation is still in progress.");
      }
      return { status: "UNCERTAIN" };
    }

  }
}

