import { NotificationEntity } from "@/domain/entities/notificationEntity";
import { INotificationRepository } from "@/domain/interface/repositories/INotificationRepository";
import { NotificationDocument, NotificationModel } from "@/framework/database/model/notificationModel";

export class NotificationRepository implements INotificationRepository {
  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const newNotification = new NotificationModel(notification);
    const doc = await newNotification.save();
    return this.mapToEntity(doc)
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const doc = await NotificationModel.findById(id).lean() as NotificationDocument | null;
    return doc ? this.mapToEntity(doc) : null;

  }
  async findByRecipient(recipientId: string): Promise<NotificationEntity[]> {
    const docs = await NotificationModel.find({ recipientId }).sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async markAsRead(id: string): Promise<void> {
    await NotificationModel.findByIdAndUpdate(id, { isRead: true });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await NotificationModel.updateMany({ recipientId, isRead: false }, { isRead: true });
  }

  async markChatAsRead(recipientId: string, conversationId: string): Promise<void> {
    await NotificationModel.updateMany({ 
      recipientId, 
      type: "CHAT", 
      "metadata.conversationId": conversationId,
      isRead: false 
    }, { isRead: true });
  }

  async countUnread(recipientId: string): Promise<number> {
    return await NotificationModel.countDocuments({ recipientId, isRead: false });
  }


  private mapToEntity(doc: NotificationDocument): NotificationEntity {
    return {
      id: doc._id.toString(),
      recipientId: doc.recipientId,
      senderId: doc.senderId,
      type: doc.type,
      title: doc.title,
      message: doc.message,
      metadata: doc.metadata,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    };
  }
}
