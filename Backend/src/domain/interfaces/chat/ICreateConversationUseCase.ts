import type { ConversationResponseDTO } from "@/domain/dto/chat/conversationResponseDto";

export interface ICreateConversationUseCase {
  createConversation(bookingId: string): Promise<ConversationResponseDTO>;
}
