export interface WallpaperData {
  _id: string;
  creatorId: string | { _id: string; fullName: string };
  title: string;
  imageUrl: string;
  watermarkedUrl?: string;
  price: number;
  hashtags: string[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  downloadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddWallpaperPayload {
  title: string;
  imageUrl: string;
  price: number;
  hashtags: string[];
}
