import type { IMarkAllNotificationReadUseCase } from "@/domain/interface/notification/IMarkAllNotificationReadUseCase";
import type { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";

export class MarkAllNotificationReadUseCase implements IMarkAllNotificationReadUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async markAllRead(recipientId: string): Promise<void> {
        await this._notificationRepo.markAllAsRead(recipientId);
    }
}
