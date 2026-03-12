import { Types } from "mongoose";

export interface ConversationEntity {
  id?: string;
  bookingId: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  participantDetails?: {
    userName: string;
    userImage?: string;
    creatorName: string;
    creatorImage?: string;
  };
  packageName?: string;
}
