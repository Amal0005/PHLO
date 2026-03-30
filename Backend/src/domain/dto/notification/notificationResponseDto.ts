import type { NotificationType } from "@/domain/entities/notificationEntity";

export interface NotificationResponseDTO {
  id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}
