import { IMarkAllNotificationReadUseCase } from "@/domain/interface/notification/IMarkAllNotificationReadUseCase";
import { INotificationRepository } from "@/domain/interface/repositories/INotificationRepository";

export class MarkAllNotificationReadUseCase implements IMarkAllNotificationReadUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async markAllRead(recipientId: string): Promise<void> {
        await this._notificationRepo.markAllAsRead(recipientId);
    }
}
