import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface IaddCategoryUseCase {
      add(name: string, description?: string): Promise<CategoryEntity>;
}