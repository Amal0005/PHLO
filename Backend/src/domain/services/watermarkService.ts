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
        
        // Use native sharp `tile: true` instead of SVG <pattern> for reliable replication
        // Replace `rgba(...)` with `fill="white" fill-opacity="0.4"` because librsvg might drop rgba on some OS
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2})">
              <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" fill-opacity="0.4" stroke="black" stroke-opacity="0.1" stroke-width="0.5" letter-spacing="2">PHLO</text>
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
