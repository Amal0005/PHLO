import type { ConversationEntity } from "@/domain/entities/conversationEntity";
import type { MessageEntity } from "@/domain/entities/messageEntity";

export interface IChatRepository {
  createConversation(data: Partial<ConversationEntity>): Promise<ConversationEntity>;
  getConversationByBooking(bookingId: string): Promise<ConversationEntity | null>;
  getConversationsByUserId(userId: string): Promise<ConversationEntity[]>;
  getMessagesByConversationId(conversationId: string): Promise<MessageEntity[]>;
  saveMessage(data: Partial<MessageEntity>): Promise<MessageEntity>;
  updateConversationLastMessage(conversationId: string, message: string): Promise<void>;
  markMessagesAsSeen(conversationId: string, userId: string): Promise<void>;
}
