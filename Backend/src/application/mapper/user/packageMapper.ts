import type { PackageEntity } from "@/domain/entities/packageEntity";
import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";

export class PackageMapper {
  static toDto(entity: PackageEntity): PackageResponseDto {
    let creatorId: string | { _id: string; fullName: string; profilePhoto?: string; city?: string } = entity.creatorId as string;
    if (typeof entity.creatorId === 'object' && entity.creatorId !== null) {
      const creator = entity.creatorId as CreatorEntity;
      creatorId = {
        _id: creator._id?.toString() || "",
        fullName: creator.fullName,
        profilePhoto: creator.profilePhoto,
        city: creator.city,
      };
    }

    return {
      _id: entity._id?.toString() || "",
      creatorId,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      category: entity.category,
      images: entity.images,
      locations: entity.locations,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
      distance: (entity as unknown as { distance?: number }).distance,
    };
  }
}
