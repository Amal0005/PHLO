import type { IMarkChatNotificationReadUseCase } from "@/domain/interface/notification/IMarkChatNotificationReadUseCase";
import type { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";

export class MarkChatNotificationReadUseCase implements IMarkChatNotificationReadUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async markChatRead(recipientId: string, conversationId: string): Promise<void> {
        await this._notificationRepo.markChatAsRead(recipientId, conversationId);
    }
}
