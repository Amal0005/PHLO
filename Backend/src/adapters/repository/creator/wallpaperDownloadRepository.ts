import type { IWallpaperDownloadRepository } from "@/domain/interfaces/repository/IWallpaperDownloadRepository";
import { WallpaperDownloadModel } from "@/framework/database/model/wallpaperDownloadModel";
import { WallpaperModel } from "@/framework/database/model/wallpapperModel";

export class WallpaperDownloadRepository implements IWallpaperDownloadRepository {
  constructor() {}
  async recordDownload(
    wallpaperId: string,
    userId: string,
    creatorId: string,
  ): Promise<boolean> {

    const result = await WallpaperDownloadModel.findOneAndUpdate(
      { wallpaperId, userId },
      { $setOnInsert: { wallpaperId, userId, creatorId } },
      { upsert: true, new: false },
    );
    const isNew = result === null;
    if (isNew) {
      await WallpaperModel.findByIdAndUpdate(wallpaperId, {
        $inc: { downloadCount: 1 },
      });
    }
    return isNew;
  }
  async getDownloadCount(wallpaperId: string): Promise<number> {
    return await WallpaperDownloadModel.countDocuments({ wallpaperId });
  }
  async hasPurchased(wallpaperId: string, userId: string): Promise<boolean> {
    const exists = await WallpaperDownloadModel.exists({ wallpaperId, userId });
    return !!exists;
  }

  async getPurchasedWallpaperIds(userId: string): Promise<string[]> {
    const rows = await WallpaperDownloadModel.find({ userId })
      .select("wallpaperId -_id")
      .lean();

    return rows.map((row) => String(row.wallpaperId));
  }
}
