export interface WallpaperData {
  _id: string;
  creatorId: string | { _id: string; fullName: string };
  title: string;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddWallpaperPayload {
  title: string;
  imageUrl: string;
}
