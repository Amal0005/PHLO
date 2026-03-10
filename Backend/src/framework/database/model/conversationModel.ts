import { model, Document, Types } from "mongoose";
import { conversationSchema } from "../schema/conversationSchema";
import { ConversationEntity } from "@/domain/entities/conversationEntity";

export interface ConversationDocument extends Document, Omit<ConversationEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ConversationModel = model<ConversationDocument>("conversation", conversationSchema);
