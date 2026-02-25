import { Schema, Types } from "mongoose";

export const wallpaperDownloadSchema = new Schema(
  {
    wallpaperId: { type: Types.ObjectId, ref: "wallpaper", required: true },
    userId: { type: Types.ObjectId, ref: "user", required: true },
    creatorId: { type: Types.ObjectId, ref: "creator", required: true },
  },
  { timestamps: true }
);

wallpaperDownloadSchema.index({ wallpaperId: 1, userId: 1 }, { unique: true });
