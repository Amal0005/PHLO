import { BookingStatus } from "@/utils/bookingStatus";
import { Schema, Types } from "mongoose";

export const bookingSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    packageId: {
      type: Types.ObjectId,
      ref: "package",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    stripeSessionId: {
      type: String,
      index: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);
bookingSchema.index({ packageId: 1, bookingDate: 1 });
