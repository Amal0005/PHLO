import { PackageEntity } from "@/domain/entities/packageEntity";
import { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { CreatorEntity } from "@/domain/entities/creatorEntities";

export class PackageMapper {
  static toDto(entity: PackageEntity): PackageResponseDto {
    let creatorId: any = entity.creatorId;
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
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
      distance: (entity as any).distance,
    };
  }
}
