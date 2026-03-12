import { NotificationEntity } from "@/domain/entities/notificationEntity";

export interface ISendNotificationUseCase {
  sendNotification(data: NotificationEntity): Promise<NotificationEntity>;
}
