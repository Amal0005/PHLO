import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IAddWallpaperUseCase } from "@/domain/interface/creator/walpapper/IAddWallpaperUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { IWatermarkService } from "@/domain/interface/service/IWatermarkService";
import { MESSAGES } from "@/utils/commonMessages";

export class AddWallpaperUseCase implements IAddWallpaperUseCase {
  constructor(
    private _wallpaperRepo: IWallpaperRepository,
    private _creatorRepo: ICreatorRepository,
    private _watermarkService: IWatermarkService,
  ) { }
  async addWallpaper(data: Partial<WallpaperEntity>): Promise<WallpaperEntity> {
    if (!data.title || !data.imageUrl || data.price === undefined || data.price === null) {
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

    // Generate watermarked version of the image
    const watermarkedUrl = await this._watermarkService.generateWatermark(data.imageUrl);

    const newWallpaper: WallpaperEntity = {
      creatorId: data.creatorId!,
      title: data.title!,
      imageUrl: data.imageUrl!,
      watermarkedUrl,
      price: data.price,
      hashtags: (data.hashtags || []).map(tag => tag.trim()).filter(tag => tag.length > 0),
      status: "pending",
    };
    return await this._wallpaperRepo.add(newWallpaper);
  }
}
