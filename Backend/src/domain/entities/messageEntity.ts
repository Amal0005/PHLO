import { Types } from "mongoose";

export interface MessageEntity {
  id?: string;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
  type: "text" | "image";
  seen: boolean;
  createdAt?: Date;
}
