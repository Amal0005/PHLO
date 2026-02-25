import sharp from "sharp";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { IWatermarkService } from "@/domain/interface/service/IWatermarkService";
import { Readable } from "stream";

export class WatermarkService implements IWatermarkService {
    private s3: S3Client;
    private bucket: string;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this.bucket = process.env.AWS_S3_BUCKET_NAME!;
    }

    async generateWatermark(originalKey: string): Promise<string> {
        const { Body } = await this.s3.send(
            new GetObjectCommand({ Bucket: this.bucket, Key: originalKey })
        );
        const chunks: Buffer[] = [];
        for await (const chunk of Body as Readable) {
            chunks.push(Buffer.from(chunk));
        }
        const originalBuffer = Buffer.concat(chunks);

        const { width = 800, height = 600 } = await sharp(originalBuffer).metadata();

        const fontSize = Math.max(Math.floor(width / 15), 24);
        const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wm" width="${fontSize * 8}" height="${fontSize * 6}" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <text x="${fontSize * 0.5}" y="${fontSize * 2}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="rgba(255,255,255,0.25)" letter-spacing="4">PHLO</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wm)" />
      </svg>`;

        const watermarkedBuffer = await sharp(originalBuffer)
            .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
            .jpeg({ quality: 85 })
            .toBuffer();
        const parts = originalKey.split("/");
        const fileName = parts.pop()!;
        const watermarkedKey = `${parts.join("/")}/watermarked/${fileName}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: watermarkedKey,
                Body: watermarkedBuffer,
                ContentType: "image/jpeg",
            })
        );

        return watermarkedKey;
    }
}
