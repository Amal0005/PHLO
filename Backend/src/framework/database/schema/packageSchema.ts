import { Schema, Types } from "mongoose";

export const packageSchema = new Schema(
  {
    creatorId: { type: Types.ObjectId, ref: "creator", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    locations: [
      {
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
        placeName: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);


packageSchema.index({ "locations.coordinates": "2dsphere" });
