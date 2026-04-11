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
        const fontSize = Math.max(Math.floor(width / 20), 24);
        const tileWidth = fontSize * 10;
        const tileHeight = fontSize * 6;
        
        // Using standard <text> rendering mapped to 'sans-serif' default OS font
        // Ensures clean and extremely legible watermarks universally.
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2})">
              <text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" font-weight="900" fill="white" fill-opacity="0.3" stroke="black" stroke-opacity="0.1" stroke-width="2" letter-spacing="8">PHLO</text>
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
