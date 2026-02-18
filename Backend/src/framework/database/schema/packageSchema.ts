import { Schema, Types } from "mongoose";

export const packageSchema = new Schema(
  {
    creatorId: { type: Types.ObjectId, ref: "creator", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    placeName: { type: String, required: false },
  },
  { timestamps: true }
);


packageSchema.index({ location: "2dsphere" });
