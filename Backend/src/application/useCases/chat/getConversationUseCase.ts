import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { IGetConversationUseCase } from "@/domain/interface/chat/IGetConversationUseCase";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository ";

export class GetConversationUseCase implements IGetConversationUseCase{
    constructor(
        private _chatRepo:IChatRepository
    ){}
    async getConversation(userId: string): Promise<ConversationEntity[]> {
        return await this._chatRepo.getConversationsByUserId(userId)
    }
}