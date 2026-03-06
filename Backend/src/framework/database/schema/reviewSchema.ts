import { Schema, Types } from "mongoose";

export const ReviewSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "user", required: true, index: true },
    packageId: { type: Types.ObjectId, ref: "package", required: true, index: true },
    bookingId: { type: Types.ObjectId, ref: "booking", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
