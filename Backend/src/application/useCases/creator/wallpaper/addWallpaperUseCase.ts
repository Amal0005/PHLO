import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IAddWallpaperUseCase } from "@/domain/interface/creator/walpapper/IAddWallpaperUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { MESSAGES } from "@/utils/commonMessages";

export class AddWallpaperUseCase implements IAddWallpaperUseCase {
  constructor(
    private _wallpaperRepo: IWallpaperRepository,
    private _creatorRepo: ICreatorRepository,
  ) { }
  async addWallpaper(data: Partial<WallpaperEntity>): Promise<WallpaperEntity> {
    if (!data.title || !data.imageUrl) {
      throw new Error(MESSAGES.ERROR.ALL_FIELDS_REQUIRED);
    }
    const creator = await this._creatorRepo.findById(data.creatorId as string);
    if (
      !creator ||
      !creator.subscription?.planId ||
      creator.subscription.endDate < new Date()
    ) {
      throw new Error("subscription required to add wallpapers.");
    }
    const newWallpaper: WallpaperEntity = {
      creatorId: data.creatorId!,
      title: data.title!,
      imageUrl: data.imageUrl!,
      status: "pending",
    };
    return await this._wallpaperRepo.add(newWallpaper);
  }
}
