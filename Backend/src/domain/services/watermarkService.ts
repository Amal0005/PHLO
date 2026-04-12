import sharp from "sharp";
import type { IWatermarkService } from "@/domain/interfaces/service/IWatermarkService";
import type { IStorageService } from "@/domain/interfaces/service/IS3Services";

export class WatermarkService implements IWatermarkService {
    constructor(private _storageService: IStorageService) {}

    async generateWatermark(originalBuffer: Buffer, originalKey: string): Promise<string> {
        const { width = 1200 } = await sharp(originalBuffer).metadata();
        
        // Optimizing density and visibility
        const fontSize = Math.max(Math.floor(width / 20), 28);
        const tileWidth = fontSize * 5;
        const tileHeight = fontSize * 4;
        
        // Multi-line blocky pattern for maximum coverage and visibility
        const strokeWidth = (fontSize / 20).toFixed(1);
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${tileWidth} ${tileHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2})">
              <text 
                x="50%" y="30%" 
                font-family="sans-serif" font-weight="950" font-size="${fontSize}" 
                text-anchor="middle" dominant-baseline="middle"
                fill="white" fill-opacity="0.5" 
                stroke="black" stroke-opacity="0.2" stroke-width="${strokeWidth}"
                letter-spacing="2"
              >PHLO</text>
              <text 
                x="50%" y="80%" 
                font-family="sans-serif" font-weight="950" font-size="${fontSize * 0.8}" 
                text-anchor="middle" dominant-baseline="middle"
                fill="white" fill-opacity="0.4" 
                stroke="black" stroke-opacity="0.15" stroke-width="${(Number(strokeWidth)/1.2).toFixed(1)}"
                letter-spacing="1"
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
            .jpeg({ quality: 85, progressive: true })
            .toBuffer();

        const parts = originalKey.split("/");
        const originalFileName = parts.pop() || "wallpaper.jpg";
        const baseFileName = originalFileName.includes('.') 
            ? originalFileName.substring(0, originalFileName.lastIndexOf('.')) 
            : originalFileName;
        
        const watermarkedKey = `${parts.join("/")}/watermarked/${baseFileName}.jpg`;

        // Using shared storage service for consistency
        await this._storageService.uploadFile(watermarkedBuffer, watermarkedKey, "image/jpeg");

        return watermarkedKey;
    }
}
