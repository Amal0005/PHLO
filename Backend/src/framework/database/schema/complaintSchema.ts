import { Schema } from "mongoose";
import { IComplaintModel } from "../model/complaintModel";

export const ComplaintSchema = new Schema<IComplaintModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "creator", required: true, index: true },
    bookingId: { type: String, ref: "booking", required: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending"
    },
    adminComment: { type: String },
  },
  { timestamps: true }
);
