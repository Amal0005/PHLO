import { model, Document, Types } from "mongoose";
import { NotificationEntity } from "@/domain/entities/notificationEntity";
import { notificationSchema } from "../schema/notificationSchema";

export interface NotificationDocument extends Document, Omit<NotificationEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const NotificationModel = model<NotificationDocument>("notification", notificationSchema);
