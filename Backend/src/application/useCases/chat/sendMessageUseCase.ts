import { MessageEntity } from "@/domain/entities/messageEntity";
import { ISendMessageUseCase } from "@/domain/interface/chat/ISendMessageUseCase";
import { IChatRepository } from "@/domain/interface/repositories/IChatRepository ";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _userRepo: IUserRepository,
        private _creatorRepo: ICreatorRepository
    ) {}

    async sendMessage(data: { conversationId: string; senderId: string; message: string; recipientId: string }): Promise<MessageEntity> {
        const message = await this._chatRepo.saveMessage({
            conversationId: data.conversationId as any,
            senderId: data.senderId as any,
            message: data.message
        });

        await this._chatRepo.updateConversationLastMessage(data.conversationId, data.message);

        // Fetch sender's name for notification via repositories
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