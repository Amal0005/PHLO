import { NotificationEntity } from "@/domain/entities/notificationEntity";
import { IGetNotificationDetailsUseCase } from "@/domain/interface/notification/IGetNotificationDetailUseCase";
import { INotificationRepository } from "@/domain/interface/repositories/INotificationRepository";

export class GetNotificationByIdUseCase implements IGetNotificationDetailsUseCase {
  constructor(
    private _notificationRepo: INotificationRepository
  ) { }
  async getDetails(notificationId: string): Promise<NotificationEntity | null> {
    return await this._notificationRepo.findById(notificationId);
  }
}