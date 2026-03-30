import type { IMarkNotificationReadUseCase } from "@/domain/interface/notification/IMarkNotificationReadUseCase";
import type { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";

export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}
    async markNotificationRead(notificationId: string): Promise<void> {
        await this._notificationRepo.markAsRead(notificationId)
    }
} 