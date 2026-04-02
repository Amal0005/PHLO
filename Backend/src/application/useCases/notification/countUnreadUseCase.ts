import type { ICountUnreadUseCase } from "@/domain/interfaces/notification/ICountUnreadUseCase";
import type { INotificationRepository } from "@/domain/interfaces/repository/INotificationRepository";

export class CountUnreadUseCase implements ICountUnreadUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}
    async countUnread(recipientId: string): Promise<number> {
        return await this._notificationRepo.countUnread(recipientId)
    }
}