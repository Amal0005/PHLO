import { model, Document, Types } from "mongoose";
import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { wallpaperSchema } from "../schema/wallpapperSchema";

export interface IWallpaperModel extends Omit<WallpaperEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const WallpaperModel = model<IWallpaperModel>("wallpaper", wallpaperSchema);
