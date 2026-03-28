import { MessageResponseDTO } from "@/domain/dto/chat/messageResponseDto";

export interface ISendMessageUseCase {
  sendMessage(data: { conversationId: string; senderId: string; message: string; recipientId: string; type?: "text" | "image" }): Promise<MessageResponseDTO>;
}
