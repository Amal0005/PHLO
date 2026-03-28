import { IGetMessagesUseCase } from "@/domain/interface/chat/IGetMessageUseCase";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository";
import { MessageResponseDTO } from "@/domain/dto/chat/messageResponseDto";
import { ChatMapper } from "../../mapper/chatMapper";

export class GetMessageUseCase implements IGetMessagesUseCase{
    constructor(
    private _chatRepo:IChatRepository
    ){}
  async getMessage(conversationId: string): Promise<MessageResponseDTO[]> {
      const messages = await this._chatRepo.getMessagesByConversationId(conversationId);
      return messages.map(msg => ChatMapper.toMessageDTO(msg));
  }
}