import sharp from "sharp";
import type { IWatermarkService } from "@/domain/interfaces/service/IWatermarkService";
import type { IStorageService } from "@/domain/interfaces/service/IS3Services";

export class WatermarkService implements IWatermarkService {
    constructor(private _storageService: IStorageService) {}

    async generateWatermark(originalBuffer: Buffer, originalKey: string): Promise<string> {
        // Load image, fix orientation, normalize colorspace, and flatten alpha (crucial for PNGs)
        const image = sharp(originalBuffer)
            .rotate()
            .toColorspace('srgb')
            .flatten({ background: { r: 0, g: 0, b: 0 } }); // Ensure no transparency in preview
            
        const { width = 1200 } = await image.metadata();
        
        // Dynamic scaling
        const scale = Math.max(width / 1200, 0.5);
        const tileWidth = Math.floor(400 * scale);
        const tileHeight = Math.floor(250 * scale);
        
        // FONT-INDEPENDENT VECTOR WATERMARK
        // This uses SVG paths to draw 'PHLO' so it works even if no fonts are installed on the server.
        // It's robust, professional, and dense.
        const tileSvg = `
          <svg width="${tileWidth}" height="${tileHeight}" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-30 200 125)" fill="white" fill-opacity="0.4" stroke="black" stroke-opacity="0.1" stroke-width="2">
              <!-- P -->
              <path d="M100,80 v90 h30 c20,0 35,-15 35,-35 s-15,-35 -35,-35 h-30 z M120,100 h15 c10,0 20,5 20,15 s-10,15 -20,15 h-15 v-30 z" />
              <!-- H -->
              <path d="M180,80 v90 h15 v-35 h25 v35 h15 v-90 h-15 v35 h-25 v-35 z" />
              <!-- L -->
              <path d="M245,80 v90 h45 v-15 h-30 v-75 z" />
              <!-- O -->
              <path d="M305,125 c0,-25 15,-45 40,-45 s40,20 40,45 s-15,45 -40,45 s-40,-20 -40,-45 z M320,125 c0,15 8,30 25,30 s25,-15 25,-30 s-8,-30 -25,-30 s-25,15 -25,30 z" />
            </g>
          </svg>`;

        const watermarkedBuffer = await image
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
