import type { IMarkNotificationReadUseCase } from "@/domain/interfaces/notification/IMarkNotificationReadUseCase";
import type { INotificationRepository } from "@/domain/interfaces/repository/INotificationRepository";

export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}
    async markNotificationRead(notificationId: string): Promise<void> {
        await this._notificationRepo.markAsRead(notificationId)
    }
} 