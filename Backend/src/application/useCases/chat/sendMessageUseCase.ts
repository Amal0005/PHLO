import { MessageEntity } from "@/domain/entities/messageEntity";
import { ISendMessageUseCase } from "@/domain/interface/chat/ISendMessageUseCase";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository";

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _userRepo: IUserRepository,
        private _creatorRepo: ICreatorRepository
    ) {}

    async sendMessage(data: { conversationId: string; senderId: string; message: string; recipientId: string }): Promise<MessageEntity> {
        const message = await this._chatRepo.saveMessage({
            conversationId: data.conversationId,
            senderId: data.senderId,
            message: data.message
        });

        await this._chatRepo.updateConversationLastMessage(data.conversationId, data.message);

        const [user, creator] = await Promise.all([
            this._userRepo.findById(data.senderId),
            this._creatorRepo.findById(data.senderId)
        ]);

        const senderName = user?.name || creator?.fullName || "Someone";

        await this._sendNotificationUseCase.sendNotification({
            recipientId: data.recipientId,
            senderId: data.senderId,
            type: NotificationType.CHAT,
            title: `New Message from ${senderName}`,
            message: data.message,
            metadata: { conversationId: data.conversationId },
            isRead: false
        });

        return message;
    }
}
