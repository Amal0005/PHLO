import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { CreatorEntity } from "@/domain/entities/creatorEntities";

export class WallpaperMapper {
    static toDto(entity: WallpaperEntity & { isPurchased?: boolean }): WallpaperResponseDto {
        let creatorId: string | { _id: string; fullName: string; profilePhoto?: string } = "";

        if (typeof entity.creatorId === 'object' && entity.creatorId !== null) {
            const creator = entity.creatorId as CreatorEntity;
            creatorId = {
                _id: creator._id?.toString() || "",
                fullName: creator.fullName,
                profilePhoto: creator.profilePhoto,
            };
        } else {
            creatorId = entity.creatorId as string;
        }

        return {
            _id: entity._id?.toString() || "",
            creatorId,
            title: entity.title,
            imageUrl: entity.imageUrl,
            watermarkedUrl: entity.watermarkedUrl,
            price: entity.price,
            hashtags: entity.hashtags,
            status: entity.status,
            rejectionReason: entity.rejectionReason,
            downloadCount: entity.downloadCount || 0,
            createdAt: entity.createdAt!,
            isPurchased: entity.isPurchased,
        };
    }
}
