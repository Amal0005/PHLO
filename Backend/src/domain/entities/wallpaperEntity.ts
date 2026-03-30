import type { WallpaperStatus } from "@/constants/wallpaperStatus";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface WallpaperEntity {
  _id?: string;
  creatorId: string | CreatorEntity;
  title: string;
  imageUrl: string;
  watermarkedUrl?: string;
  price: number;
  hashtags: string[];
  status: WallpaperStatus;
  rejectionReason?: string;
  downloadCount?: number
  createdAt?: Date;
}
