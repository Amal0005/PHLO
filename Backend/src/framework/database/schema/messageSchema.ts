import { Schema, Types } from "mongoose";

export const messageSchema = new Schema({
  conversationId: { type: Types.ObjectId, ref: "Conversation", required: true },
  senderId: { type: Types.ObjectId, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["text", "image"], default: "text" },
  seen: { type: Boolean, default: false },
}, { timestamps: true });
