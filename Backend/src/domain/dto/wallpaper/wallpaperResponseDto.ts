import { WallpaperStatus } from "@/constants/wallpaperStatus";

export interface WallpaperResponseDto {
    _id: string;
    creatorId: string | {
        _id: string;
        fullName: string;
        profilePhoto?: string;
    };
    title: string;
    imageUrl: string;
    watermarkedUrl?: string;
    price: number;
    hashtags: string[];
    status: WallpaperStatus;
    downloadCount: number;
    createdAt: Date;
    rejectionReason?: string;
    isPurchased?: boolean;
}
