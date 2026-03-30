import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import { messageSchema } from "@/framework/database/schema/messageSchema";
import type { MessageEntity } from "@/domain/entities/messageEntity";

export interface MessageDocument extends Document, Omit<MessageEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const MessageModel = model<MessageDocument>("message", messageSchema);
