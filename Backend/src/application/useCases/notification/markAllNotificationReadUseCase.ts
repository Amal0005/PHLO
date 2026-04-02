import type { IMarkAllNotificationReadUseCase } from "@/domain/interfaces/notification/IMarkAllNotificationReadUseCase";
import type { INotificationRepository } from "@/domain/interfaces/repository/INotificationRepository";

export class MarkAllNotificationReadUseCase implements IMarkAllNotificationReadUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async markAllRead(recipientId: string): Promise<void> {
        await this._notificationRepo.markAllAsRead(recipientId);
    }
}
