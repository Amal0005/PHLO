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
        const { width = 1200, height = 1200 } = await sharp(originalBuffer).metadata();
        
        // Optimizing font size and tile density for a high-end look
        const fontSize = Math.max(Math.floor(width / 22), 26);
        const tileWidth = Math.floor(fontSize * 6.5);
        const tileHeight = Math.floor(fontSize * 4.5);
        
        // Multi-line professional pattern with balanced opacity
        const strokeWidth = (fontSize / 25).toFixed(1);
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${tileWidth} ${tileHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2})">
              <text 
                x="50%" y="30%" 
                font-family="sans-serif" font-weight="900" font-size="${fontSize}" 
                text-anchor="middle" dominant-baseline="middle"
                fill="white" fill-opacity="0.45" 
                stroke="black" stroke-opacity="0.15" stroke-width="${strokeWidth}"
              >PHLO</text>
              <text 
                x="50%" y="75%" 
                font-family="sans-serif" font-weight="900" font-size="${Math.floor(fontSize * 0.75)}" 
                text-anchor="middle" dominant-baseline="middle"
                fill="white" fill-opacity="0.35" 
                stroke="black" stroke-opacity="0.1" stroke-width="${(Number(strokeWidth)/1.5).toFixed(1)}"
              >PHLO</text>
            </g>
          </svg>`;

        const watermarkedBuffer = await sharp(originalBuffer)
            .composite([{ 
                input: Buffer.from(tileSvg), 
                tile: true,
                top: 0, 
                left: 0 
            }])
            .jpeg({ quality: 82, progressive: true })
            .toBuffer();

        const parts = originalKey.split("/");
        const originalFileName = parts.pop()!;
        const baseFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
        
        // Use a strictly clean filename and forced jpg extension for the public watermark preview
        const watermarkedKey = `${parts.join("/")}/watermarked/${baseFileName}.jpg`;

        await this._s3.send(
            new PutObjectCommand({
                Bucket: this._bucket,
                Key: watermarkedKey,
                Body: watermarkedBuffer,
                ContentType: "image/jpeg",
                CacheControl: "public, max-age=31536000, immutable"
            })
        );

        return watermarkedKey;
    }
}
