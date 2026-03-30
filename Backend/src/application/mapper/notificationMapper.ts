import type { NotificationEntity } from "@/domain/entities/notificationEntity";
import type { NotificationResponseDTO } from "@/domain/dto/notification/notificationResponseDto";

export class NotificationMapper {
  static toDto(entity: NotificationEntity): NotificationResponseDTO {
    const notificationData = entity as unknown as { _id?: { toString(): string } };
    return {
      id: entity.id || notificationData._id?.toString() || "",
      recipientId: entity.recipientId,
      senderId: entity.senderId,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      metadata: entity.metadata,
      isRead: entity.isRead,
      createdAt: entity.createdAt || new Date(),
    };
  }

  static toDtoList(entities: NotificationEntity[]): NotificationResponseDTO[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
