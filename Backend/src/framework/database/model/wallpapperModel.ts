import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { wallpaperSchema } from "@/framework/database/schema/wallpapperSchema";

export interface IWallpaperModel extends Omit<WallpaperEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const WallpaperModel = model<IWallpaperModel>("wallpaper", wallpaperSchema);
