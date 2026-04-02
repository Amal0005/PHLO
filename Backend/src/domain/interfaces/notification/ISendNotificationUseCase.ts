import type { NotificationEntity } from "@/domain/entities/notificationEntity";
import type { NotificationResponseDTO } from "@/domain/dto/notification/notificationResponseDto";

export interface ISendNotificationUseCase {
  sendNotification(data: NotificationEntity): Promise<NotificationResponseDTO>;
}
