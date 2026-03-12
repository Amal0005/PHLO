import { MessageEntity } from "@/domain/entities/messageEntity";

export interface ISendMessageUseCase {
  sendMessage(data: { conversationId: string; senderId: string; message: string; recipientId: string }): Promise<MessageEntity>;
}
