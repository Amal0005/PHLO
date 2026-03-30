import type { CategoryEntity } from "@/domain/entities/categoryEntity";
import type { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";

export class CategoryMapper {
    static toDto(entity: CategoryEntity): CategoryResponseDto {
        return {
            categoryId: entity._id?.toString() || "",
            _id: entity._id?.toString() || "",
            name: entity.name,
            description: entity.description,
            image: entity.image,
            createdAt: entity.createdAt || new Date(),
            updatedAt: entity.updatedAt || new Date(),
        };
    }
}
