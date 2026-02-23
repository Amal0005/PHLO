import { Schema, Types } from "mongoose";

export const wallpaperSchema = new Schema(
  {
    creatorId: { type: Types.ObjectId, ref: "creator", required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);
