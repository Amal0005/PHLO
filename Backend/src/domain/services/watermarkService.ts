import sharp from "sharp";
import type { IWatermarkService } from "@/domain/interfaces/service/IWatermarkService";
import type { IStorageService } from "@/domain/interfaces/service/IS3Services";

export class WatermarkService implements IWatermarkService {
    constructor(private _storageService: IStorageService) {}

    async generateWatermark(originalBuffer: Buffer, originalKey: string): Promise<string> {
        // Load image and normalize (fix orientation and colorspace for JPEGs)
        const image = sharp(originalBuffer).rotate().toColorspace('srgb');
        const { width = 1200 } = await image.metadata();
        
        // Optimizing density and visibility
        const fontSize = Math.max(Math.floor(width / 20), 28);
        const tileWidth = fontSize * 5;
        const tileHeight = fontSize * 4;
        
        // Robust SVG pattern
        // Using common font stack to prevent 'squares' (tofu) on different environments
        const strokeWidth = (fontSize / 20).toFixed(1);
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2})">
              <text 
                x="50%" y="30%" 
                font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fontSize}" 
                text-anchor="middle" dominant-baseline="middle"
                fill="white" fill-opacity="0.5" 
                stroke="black" stroke-opacity="0.2" stroke-width="${strokeWidth}"
              >PHLO</text>
              <text 
                x="50%" y="80%" 
                font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${Math.floor(fontSize * 0.7)}" 
                text-anchor="middle" dominant-baseline="middle"
                fill="white" fill-opacity="0.4" 
                stroke="black" stroke-opacity="0.1" stroke-width="${(Number(strokeWidth)/2).toFixed(1)}"
              >PHLO</text>
            </g>
          </svg>`;

        const watermarkedBuffer = await image
            .ensureAlpha() // Crucial for JPEGs to handle transparent overlays correctly
            .composite([{ 
                input: Buffer.from(tileSvg), 
                tile: true
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
