import type { IGetMessagesUseCase } from "@/domain/interfaces/chat/IGetMessageUseCase";
import type { IChatRepository } from "@/domain/interfaces/repository/IChatRepository";
import type { MessageResponseDTO } from "@/domain/dto/chat/messageResponseDto";
import { ChatMapper } from "@/application/mapper/chatMapper";

export class GetMessageUseCase implements IGetMessagesUseCase {
  constructor(
    private _chatRepo: IChatRepository
  ) {}
  async getMessage(conversationId: string, page?: number, limit?: number): Promise<MessageResponseDTO[]> {
    const messages = await this._chatRepo.getMessagesByConversationId(conversationId, page, limit);
    return messages.map(msg => ChatMapper.toMessageDTO(msg));
  }
}