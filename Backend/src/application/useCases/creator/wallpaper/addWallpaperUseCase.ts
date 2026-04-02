import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import type { IModerationService } from "@/domain/interfaces/service/IModerationService";
import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import type { IAddWallpaperUseCase } from "@/domain/interfaces/creator/walpapper/IAddWallpaperUseCase";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IWallpaperRepository } from "@/domain/interfaces/repository/IWallpaperRepository";
import type { IWatermarkService } from "@/domain/interfaces/service/IWatermarkService";
import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";

import type { IStorageService } from "@/domain/interfaces/service/IS3Services";
import { MESSAGES } from "@/constants/commonMessages";
import crypto from "crypto";

export class AddWallpaperUseCase implements IAddWallpaperUseCase {
  constructor(
    private _wallpaperRepo: IWallpaperRepository,
    private _creatorRepo: ICreatorRepository,
    private _watermarkService: IWatermarkService,
    private _userRepo: IUserRepository,
    private _sendNotificationUseCase: ISendNotificationUseCase,
    private _moderationService: IModerationService,
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

    // Generate watermarked image
    const watermarkedUrl = await this._watermarkService.generateWatermark(imageBuffer, originalKey);

    // Perform moderation check on the original image buffer
    const moderationResult = await this._moderationService.checkImage(imageBuffer);
    let status: "approved" | "pending" | "rejected" = "pending";
    let rejectionReason: string | undefined;
    if (moderationResult === "SAFE") {
      status = "approved";
    } else if (moderationResult === "UNSAFE") {
      status = "rejected";
      rejectionReason = "Image content violates community guidelines.";
    } else {
      status = "rejected";
      rejectionReason = "Moderation service currently unavailable (possible billing/propagation delay). Please try again in 5-10 minutes.";
    }

    const newWallpaper: WallpaperEntity = {
      creatorId: data.creatorId!,
      title: data.title!,
      imageUrl: originalKey,
      watermarkedUrl,
      price: data.price,
      hashtags: (data.hashtags || []).map(tag => tag.trim()).filter(tag => tag.length > 0),
      status,
      rejectionReason,
    };
    const created = await this._wallpaperRepo.add(newWallpaper);

    return WallpaperMapper.toDto(created);
  }
}
