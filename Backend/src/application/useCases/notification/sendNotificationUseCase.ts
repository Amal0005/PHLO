import { NotificationEntity } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { INotificationRepository } from "@/domain/interface/repositories/INotificationRepository";

import { SocketIOHandler } from "@/framework/socket/socketIOHandler";

export class SendNotificationUseCase implements ISendNotificationUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ) { }
    async sendNotification(data: NotificationEntity): Promise<NotificationEntity> {
        const notification = await this._notificationRepo.save(data)
        // Emit via socket
        SocketIOHandler.emitToUser(data.recipientId, "notification", notification);
        return notification
    }
}