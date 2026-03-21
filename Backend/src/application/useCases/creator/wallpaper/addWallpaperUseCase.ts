import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IAddWallpaperUseCase } from "@/domain/interface/creator/walpapper/IAddWallpaperUseCase";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { IWatermarkService } from "@/domain/interface/service/IWatermarkService";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";
import { IStorageService } from "@/domain/interface/service/IS3Services";
import { MESSAGES } from "@/constants/commonMessages";
import crypto from "crypto";

export class AddWallpaperUseCase implements IAddWallpaperUseCase {
  constructor(
    private _wallpaperRepo: IWallpaperRepository,
    private _creatorRepo: ICreatorRepository,
    private _watermarkService: IWatermarkService,
    private _userRepo: IUserRepository,
    private _sendNotificationUseCase: ISendNotificationUseCase,
    private _storageService: IStorageService,
  ) {}
  async addWallpaper(data: Partial<WallpaperEntity>, imageBuffer: Buffer, contentType: string): Promise<WallpaperResponseDto> {
    if (!data.title || data.price === undefined || data.price === null) {
      throw new Error(MESSAGES.ERROR.ALL_FIELDS_REQUIRED);
    }
    if (data.price < 0) {
      throw new Error("Price must be 0 or more");
    }
    const creator = await this._creatorRepo.findById(data.creatorId as string);
    if (
      !creator ||
      !creator.subscription?.planId ||
      creator.subscription.endDate < new Date()
    ) {
      throw new Error("subscription required to add wallpapers.");
    }

    // Generate path and upload original
    const extension = contentType.split("/")[1];
    const originalKey = `wallpapers/${crypto.randomUUID()}.${extension}`;
    await this._storageService.uploadFile(imageBuffer, originalKey, contentType);

    const watermarkedUrl = await this._watermarkService.generateWatermark(imageBuffer, originalKey);

    const newWallpaper: WallpaperEntity = {
      creatorId: data.creatorId!,
      title: data.title!,
      imageUrl: originalKey,
      watermarkedUrl,
      price: data.price,
      hashtags: (data.hashtags || []).map(tag => tag.trim()).filter(tag => tag.length > 0),
      status: "pending",
    };
    const created = await this._wallpaperRepo.add(newWallpaper);

    // Notify Admin
    const adminId = await this._userRepo.findAdminId();
    if (adminId) {
      await this._sendNotificationUseCase.sendNotification({
        recipientId: adminId,
        type: NotificationType.ACCOUNT,
        title: "New Wallpaper Uploaded",
        message: `Creator ${creator.fullName} has uploaded a new wallpaper: ${data.title}. Needs approval.`,
        isRead: false
      });
    }

    return WallpaperMapper.toDto(created);
  }
}
