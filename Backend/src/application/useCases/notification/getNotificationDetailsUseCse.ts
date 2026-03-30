import type { NotificationEntity } from "@/domain/entities/notificationEntity";
import type { IGetNotificationDetailsUseCase } from "@/domain/interface/notification/IGetNotificationDetailUseCase";
import type { INotificationRepository } from "@/domain/interface/repository/INotificationRepository";

export class GetNotificationByIdUseCase implements IGetNotificationDetailsUseCase {
  constructor(
    private _notificationRepo: INotificationRepository
  ){}
  async getDetails(notificationId: string): Promise<NotificationEntity | null> {
    return await this._notificationRepo.findById(notificationId);
  }
}