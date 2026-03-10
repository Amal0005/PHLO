import { ConversationEntity } from "@/domain/entities/conversationEntity";

export interface IGetConversationUseCase {
  getConversation(userId: string): Promise<ConversationEntity[]>;
}
