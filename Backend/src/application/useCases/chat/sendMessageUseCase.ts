import type { ISendMessageUseCase } from "@/domain/interfaces/chat/ISendMessageUseCase";
import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { IChatRepository } from "@/domain/interfaces/repository/IChatRepository";
import type { MessageResponseDTO } from "@/domain/dto/chat/messageResponseDto";
import { ChatMapper } from "@/application/mapper/chatMapper";

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _userRepo: IUserRepository,
        private _creatorRepo: ICreatorRepository
    ) {}

    async sendMessage(data: { conversationId: string; senderId: string; message: string; recipientId: string; type?: "text" | "image" }): Promise<MessageResponseDTO> {
        const messageType = data.type || "text";
        const message = await this._chatRepo.saveMessage({
            conversationId: data.conversationId,
            senderId: data.senderId,
            message: data.message,
            type: messageType
        });

        const lastMessageText = messageType === "image" ? "Sent an image" : data.message;
        await this._chatRepo.updateConversationLastMessage(data.conversationId, lastMessageText);

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

        return ChatMapper.toMessageDTO(message);
    }
}
