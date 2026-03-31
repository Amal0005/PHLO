import type { MessageResponseDTO } from "@/domain/dto/chat/messageResponseDto";

export interface IGetMessagesUseCase {
  getMessage(conversationId: string, page?: number, limit?: number): Promise<MessageResponseDTO[]>;
}
