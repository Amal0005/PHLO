import { Schema, Types } from "mongoose";

export const leaveSchema = new Schema(
  {
    creatorId: {
      type: Types.ObjectId,
      ref: "creator",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

leaveSchema.index({ creatorId: 1, date: 1 }, { unique: true });
