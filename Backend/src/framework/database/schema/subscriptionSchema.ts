import { Schema } from "mongoose";

export const subscriptionSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["User", "Creator"], required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
