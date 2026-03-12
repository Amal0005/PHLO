import { IMarkChatNotificationReadUseCase } from "@/domain/interface/notification/IMarkChatNotificationReadUseCase";
import { INotificationRepository } from "@/domain/interface/repositories/INotificationRepository";

export class MarkChatNotificationReadUseCase implements IMarkChatNotificationReadUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async markChatRead(recipientId: string, conversationId: string): Promise<void> {
        await this._notificationRepo.markChatAsRead(recipientId, conversationId);
    }
}
