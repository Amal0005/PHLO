import { WallpaperStatus } from "@/utils/wallpaperStatus";
import { CreatorEntity } from "./creatorEntities";

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
