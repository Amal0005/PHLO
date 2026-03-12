import { NotificationType } from "@/domain/entities/notificationEntity";
import { Schema } from "mongoose";

export const notificationSchema = new Schema(
  {
    recipientId: { type: String, required: true, index: true },
    senderId: { type: String },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Map, of: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);
