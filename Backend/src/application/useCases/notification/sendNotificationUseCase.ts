import { NotificationEntity } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";
import { NotificationResponseDTO } from "@/domain/dto/notification/notificationResponseDto";
import { NotificationMapper } from "../../mapper/notificationMapper";

import { SocketIOHandler } from "@/framework/socket/socketIOHandler";

export class SendNotificationUseCase implements ISendNotificationUseCase {
    constructor(
        private _notificationRepo: INotificationRepository
    ){}
    async sendNotification(data: NotificationEntity): Promise<NotificationResponseDTO> {
        const notification = await this._notificationRepo.save(data)
        // Emit via socket
        const dto = NotificationMapper.toDto(notification);
        SocketIOHandler.emitToUser(data.recipientId, "notification", dto);
        return dto;
    }
}