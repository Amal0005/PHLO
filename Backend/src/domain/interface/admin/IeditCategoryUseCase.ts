import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface IEditCategoryUseCase {
  edit(categoryId: string, name: string, description?: string): Promise<CategoryEntity | null>;
}
