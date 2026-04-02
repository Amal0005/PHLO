import type { NotificationEntity } from "@/domain/entities/notificationEntity";

export interface IGetNotificationsUseCase {
  getNotification(recipientId: string, skip?: number, limit?: number): Promise<NotificationEntity[]>;
}