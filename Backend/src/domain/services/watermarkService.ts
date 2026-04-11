import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { IWatermarkService } from "@/domain/interfaces/service/IWatermarkService";

export class WatermarkService implements IWatermarkService {
    private _s3: S3Client;
    private _bucket: string;

    constructor() {
        this._s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this._bucket = process.env.AWS_S3_BUCKET_NAME!;
    }

    async generateWatermark(originalBuffer: Buffer, originalKey: string): Promise<string> {
        const { width = 800 } = await sharp(originalBuffer).metadata();
        
        // Dynamically scale font size and tile size based on image width
        const fontSize = Math.max(Math.floor(width / 25), 14);
        const tileWidth = fontSize * 5;
        const tileHeight = fontSize * 3.5;
        
        // Use native sharp `tile: true` and 100% vector paths to guarantee rendering
        // on servers without font packages installed (like minimal Docker/Linux instances)
        const scale = fontSize / 20; 
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2}) scale(${scale}) translate(0, 20)" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
              <!-- P -->
              <path d="M 20 10 L 20 90 M 20 10 L 45 10 Q 75 10 75 35 Q 75 60 45 60 L 20 60" />
              <!-- H -->
              <path d="M 100 10 L 100 90 M 140 10 L 140 90 M 100 50 L 140 50" />
              <!-- L -->
              <path d="M 165 10 L 165 90 L 195 90" />
              <!-- O -->
              <ellipse cx="240" cy="50" rx="25" ry="40" />
            </g>
          </svg>`;

        const watermarkedBuffer = await sharp(originalBuffer)
            .composite([{ 
                input: Buffer.from(tileSvg), 
                tile: true,
                top: 0, 
                left: 0 
            }])
            .jpeg({ quality: 85 })
            .toBuffer();
        const parts = originalKey.split("/");
        const fileName = parts.pop()!;
        const watermarkedKey = `${parts.join("/")}/watermarked/${fileName}`;

        await this._s3.send(
            new PutObjectCommand({
                Bucket: this._bucket,
                Key: watermarkedKey,
                Body: watermarkedBuffer,
                ContentType: "image/jpeg",
            })
        );

        return watermarkedKey;
    }
}
