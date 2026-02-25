import { model, Document, Types } from "mongoose";
import { WallpaperDownloadEntity } from "@/domain/entities/wallpaperDownloadEntity";
import { wallpaperDownloadSchema } from "../schema/wallpaperDownloadSchema";

export interface IWallpaperDownloadModel extends Omit<WallpaperDownloadEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const WallpaperDownloadModel = model<IWallpaperDownloadModel>("wallpaperDownload", wallpaperDownloadSchema);
