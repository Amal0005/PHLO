import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IWallpaperModel } from "@/framework/database/model/wallpapperModel";

export class WallpaperMapper {
  static toEntity(doc: IWallpaperModel): WallpaperEntity {
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      _id: obj._id.toString(),
      creatorId: obj.creatorId,
      title: obj.title,
      imageUrl: obj.imageUrl,
      watermarkedUrl: obj.watermarkedUrl ?? undefined,
      price: obj.price,
      hashtags: obj.hashtags || [],
      status: obj.status,
      rejectionReason: obj.rejectionReason ?? undefined,
      downloadCount: obj.downloadCount ?? 0,
      createdAt: obj.createdAt,
    };
  }
}
