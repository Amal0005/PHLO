import type { NotificationEntity } from "@/domain/entities/notificationEntity";
import type { IGetNotificationsUseCase } from "@/domain/interface/notification/IGetNotificationsUseCase";
import type { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) {}
    async getNotification(recipientId: string, skip?: number, limit?: number): Promise<NotificationEntity[]> {
        return await this._notificationRepo.findByRecipient(recipientId, skip, limit)
    }
}