import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import { conversationSchema } from "@/framework/database/schema/conversationSchema";
import type { ConversationEntity } from "@/domain/entities/conversationEntity";

export interface ConversationDocument extends Document, Omit<ConversationEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ConversationModel = model<ConversationDocument>("conversation", conversationSchema);
