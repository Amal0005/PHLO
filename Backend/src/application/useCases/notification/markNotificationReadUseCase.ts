import { IMarkNotificationReadUseCase } from "@/domain/interface/notification/IMarkNotificationReadUseCase";
import { INotificationRepository } from "@/domain/interface/repositories/INotificationRepository";

export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}
    async markNotificationRead(notificationId: string): Promise<void> {
        await this._notificationRepo.markAsRead(notificationId)
    }
} 