import { Schema, Types } from "mongoose";

export const conversationSchema = new Schema({
  bookingId: { type: Types.ObjectId, ref: "booking", required: true },
  participants: [{ type: Types.ObjectId, required: true }],
  lastMessage: { type: String },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });
