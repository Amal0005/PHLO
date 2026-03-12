import { Schema } from "mongoose";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IComplaintModel } from "../model/complaintModel";

export const ComplaintSchema = new Schema<IComplaintModel>(
  {
    userId: { type: String, ref: "user", required: true, index: true },
    creatorId: { type: String, ref: "creator", required: true, index: true },
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
