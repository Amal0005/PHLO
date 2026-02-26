import { Schema, Types } from "mongoose";

export const wishlistSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "user", required: true },
        itemId: { type: Types.ObjectId, required: true },
        itemType: { type: String, enum: ["wallpaper", "package"], required: true },
    },
    { timestamps: true }
);

wishlistSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });
