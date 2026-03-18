import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";

export interface IAddCategoryUseCase {
      add(name: string, description?: string): Promise<CategoryResponseDto>;
}
