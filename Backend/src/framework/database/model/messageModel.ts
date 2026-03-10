import { model, Document, Types } from "mongoose";
import { messageSchema } from "../schema/messageSchema";
import { MessageEntity } from "@/domain/entities/messageEntity";

export interface MessageDocument extends Document, Omit<MessageEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const MessageModel = model<MessageDocument>("message", messageSchema);
