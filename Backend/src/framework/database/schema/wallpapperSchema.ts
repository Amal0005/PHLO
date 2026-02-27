import { Schema, Types } from "mongoose";

export const wallpaperSchema = new Schema(
  {
    creatorId: { type: Types.ObjectId, ref: "creator", required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    watermarkedUrl: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    hashtags: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);
