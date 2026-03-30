import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { NotificationEntity } from "@/domain/entities/notificationEntity";
import { notificationSchema } from "@/framework/database/schema/notificationSchema";

export interface NotificationDocument extends Document, Omit<NotificationEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const NotificationModel = model<NotificationDocument>("notification", notificationSchema);
