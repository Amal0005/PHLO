import { MessageEntity } from "@/domain/entities/messageEntity";
import { IGetMessagesUseCase } from "@/domain/interface/chat/IGetMessageUseCase";
import { IChatRepository } from "@/domain/interface/repositories/IChatRepository ";

export class GetMessageUseCase implements IGetMessagesUseCase{
    constructor(
    private _chatRepo:IChatRepository
    ){}
  async getMessage(conversationId: string): Promise<MessageEntity[]> {
      return await this._chatRepo.getMessagesByConversationId(conversationId)
  }
}