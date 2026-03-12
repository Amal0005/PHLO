import { NotificationEntity } from "@/domain/entities/notificationEntity";

export interface IGetNotificationsUseCase {
  getNotification(recipientId: string): Promise<NotificationEntity[]>;
}