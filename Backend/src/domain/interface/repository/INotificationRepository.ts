import type { NotificationEntity } from "@/domain/entities/notificationEntity";

export interface INotificationRepository {
  save(notification: NotificationEntity): Promise<NotificationEntity>;
  findById(id: string): Promise<NotificationEntity | null>;
  findByRecipient(recipientId: string, skip?: number, limit?: number): Promise<NotificationEntity[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  countUnread(recipientId: string): Promise<number>;
  markChatAsRead(recipientId: string, conversationId: string): Promise<void>;
}
