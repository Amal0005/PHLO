import { ICountUnreadUseCase } from "@/domain/interface/notification/ICountUnreadUseCase";
import { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";

export class CountUnreadUseCase implements ICountUnreadUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}
    async countUnread(recipientId: string): Promise<number> {
        return await this._notificationRepo.countUnread(recipientId)
    }
}