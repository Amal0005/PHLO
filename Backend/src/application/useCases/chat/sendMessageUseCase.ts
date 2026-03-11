import { MessageEntity } from "@/domain/entities/messageEntity";
import { ISendMessageUseCase } from "@/domain/interface/chat/ISendMessageUseCase";
import { IChatRepository } from "@/domain/interface/repositories/IChatRepository ";
import { Types } from "mongoose";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase
    ) { }
    async sendMessage(data: { conversationId: string; senderId: string; message: string; recipientId: string }): Promise<MessageEntity> {
        const message = await this._chatRepo.saveMessage({
            conversationId: new Types.ObjectId(data.conversationId),
            senderId: new Types.ObjectId(data.senderId),
            message: data.message
        });
        await this._chatRepo.updateConversationLastMessage(data.conversationId, data.message);

        await this._sendNotificationUseCase.sendNotification({
            recipientId: data.recipientId,
            senderId: data.senderId,
            type: NotificationType.CHAT,
            title: "New Message",
            message: data.message,
            isRead: false
        });

        return message
    }
}