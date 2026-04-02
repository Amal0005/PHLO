import type { IGetConversationUseCase } from "@/domain/interfaces/chat/IGetConversationUseCase";
import type { IChatRepository } from "@/domain/interfaces/repository/IChatRepository";
import type { ConversationResponseDTO } from "@/domain/dto/chat/conversationResponseDto";
import { ChatMapper } from "@/application/mapper/chatMapper";

export class GetConversationUseCase implements IGetConversationUseCase{
    constructor(
        private _chatRepo:IChatRepository
    ){}
    async getConversation(userId: string): Promise<ConversationResponseDTO[]> {
        const conversations = await this._chatRepo.getConversationsByUserId(userId);
        return conversations.map(conv => ChatMapper.toConversationDTO(conv));
    }
}