import { NotificationEntity } from "@/domain/entities/notificationEntity";
import { NotificationResponseDTO } from "@/domain/dto/notification/notificationResponseDto";

export interface ISendNotificationUseCase {
  sendNotification(data: NotificationEntity): Promise<NotificationResponseDTO>;
}
