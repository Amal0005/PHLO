import type { NotificationEntity } from "@/domain/entities/notificationEntity";

export interface IGetNotificationDetailsUseCase {
  getDetails(notificationId: string): Promise<NotificationEntity | null>;
}