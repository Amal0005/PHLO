import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";

export interface IEditCategoryUseCase {
    edit(categoryId: string, name: string, description?: string): Promise<CategoryResponseDto | null>;
}

