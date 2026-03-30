import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { WallpaperDownloadEntity } from "@/domain/entities/wallpaperDownloadEntity";
import { wallpaperDownloadSchema } from "@/framework/database/schema/wallpaperDownloadSchema";

export interface IWallpaperDownloadModel extends Omit<WallpaperDownloadEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const WallpaperDownloadModel = model<IWallpaperDownloadModel>("wallpaperDownload", wallpaperDownloadSchema);
