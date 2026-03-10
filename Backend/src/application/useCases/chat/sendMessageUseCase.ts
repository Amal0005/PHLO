import { MessageEntity } from "@/domain/entities/messageEntity";
import { ISendMessageUseCase } from "@/domain/interface/chat/ISendMessageUseCase";
import { IChatRepository } from "@/domain/interface/repositories/IChatRepository ";
import { Types } from "mongoose";

export class SendMessageUseCase implements ISendMessageUseCase{
    constructor(
        private _chatRepo:IChatRepository
    ){}
    async sendMessage(data: { conversationId: string; senderId: string; message: string; }): Promise<MessageEntity> {
           const message = await this._chatRepo.saveMessage({
        conversationId: new Types.ObjectId(data.conversationId),
        senderId: new Types.ObjectId(data.senderId),
        message: data.message
    });
        await this._chatRepo.updateConversationLastMessage(data.conversationId, data.message);
    return message
    }
}