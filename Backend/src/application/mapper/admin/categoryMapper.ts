import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";

export class CategoryMapper {
    static toDto(entity: CategoryEntity): CategoryResponseDto {
        return {
            _id: entity._id?.toString() || "",
            name: entity.name,
            description: entity.description,
            image: entity.image,
            createdAt: entity.createdAt!,
            updatedAt: entity.updatedAt!,
        };
    }
}
