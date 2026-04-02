import type { IMarkChatNotificationReadUseCase } from "@/domain/interfaces/notification/IMarkChatNotificationReadUseCase";
import type { INotificationRepository } from "@/domain/interfaces/repository/INotificationRepository";

export class MarkChatNotificationReadUseCase implements IMarkChatNotificationReadUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async markChatRead(recipientId: string, conversationId: string): Promise<void> {
        await this._notificationRepo.markChatAsRead(recipientId, conversationId);
    }
}
