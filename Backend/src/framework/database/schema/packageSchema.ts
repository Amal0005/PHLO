import { Schema, Types } from "mongoose";

export const packageSchema = new Schema(
  {
    creatorId: { type: Types.ObjectId, ref: "creator", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Types.ObjectId, ref: "category", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);
