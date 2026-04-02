import type { ConversationResponseDTO } from "@/domain/dto/chat/conversationResponseDto";

export interface IGetConversationUseCase {
  getConversation(userId: string): Promise<ConversationResponseDTO[]>;
}
