import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import {
  IWallpaperModel,
  WallpaperModel,
} from "@/framework/database/model/wallpapperModel";
import { BaseRepository } from "../baseRepository";
import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { QueryFilter, UpdateQuery } from "mongoose";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export class WallpaperRepository
  extends BaseRepository<WallpaperEntity, IWallpaperModel>
  implements IWallpaperRepository {
  constructor() {
    super(WallpaperModel);
  } async add(data: WallpaperEntity): Promise<WallpaperEntity> {
    const created = await this.model.create(
      data as unknown as Partial<IWallpaperModel>,
    );
    return this.mapToEntity(created as IWallpaperModel);
  }
  async findByCreatorId(
    creatorId: string,
    page: number,
    limit: number,
    search?: string,
    status?: WallpaperStatus,
  ): Promise<PaginatedResult<WallpaperEntity>> {
    const query: QueryFilter<IWallpaperModel> = { creatorId };
    if (search?.trim()) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);
    return {
      data: docs.map((d) => this.mapToEntity(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findByStatus(
    status: WallpaperStatus,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<WallpaperEntity>> {
    const skip = (page - 1) * limit;
    const query: QueryFilter<IWallpaperModel> = { status };
    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .populate("creatorId", "fullName profilePhoto")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);
    return {
      data: docs.map((d) => this.mapToEntity(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findApproved(
    page: number,
    limit: number,
    search?: string,
    hashtag?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<PaginatedResult<WallpaperEntity>> {
    return await this.findAllWallpapers(page, limit, "approved", search, hashtag, minPrice, maxPrice);
  }
  async updateStatus(
    id: string,
    status: WallpaperStatus,
    rejectionReason?: string,
  ): Promise<WallpaperEntity | null> {
    const updateData: UpdateQuery<IWallpaperModel> = { status };
    if (status == "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    if (status == "approved") {
      updateData.rejectionReason = null;
    }
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
    return updated ? this.mapToEntity(updated) : null;
  }
  async findAllWallpapers(
    page: number,
    limit: number,
    status?: WallpaperStatus,
    search?: string,
    hashtag?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<PaginatedResult<WallpaperEntity>> {
    const query: QueryFilter<IWallpaperModel> = {};
    if (status) {
      query.status = status;
    }
    if (search?.trim()) {
      query.title = { $regex: search, $options: "i" };
    }
    if (hashtag?.trim()) {
      query.hashtags = { $regex: `^${hashtag}$`, $options: "i" };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      };
    }
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .populate("creatorId", "fullName profilePhoto")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);
    return {
      data: docs.map((d) => this.mapToEntity(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  protected mapToEntity(doc: IWallpaperModel): WallpaperEntity {
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
