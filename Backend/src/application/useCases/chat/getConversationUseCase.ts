import { IGetConversationUseCase } from "@/domain/interface/chat/IGetConversationUseCase";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository";
import { ConversationResponseDTO } from "@/domain/dto/chat/conversationResponseDto";
import { ChatMapper } from "../../mapper/chatMapper";

export class GetConversationUseCase implements IGetConversationUseCase{
    constructor(
        private _chatRepo:IChatRepository
    ){}
    async getConversation(userId: string): Promise<ConversationResponseDTO[]> {
        const conversations = await this._chatRepo.getConversationsByUserId(userId);
        return conversations.map(conv => ChatMapper.toConversationDTO(conv));
    }
}