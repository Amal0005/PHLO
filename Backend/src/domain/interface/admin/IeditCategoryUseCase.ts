import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface IeditCategoryUseCase {
  edit(categoryId: string, name: string, description?: string): Promise<CategoryEntity | null>;
}