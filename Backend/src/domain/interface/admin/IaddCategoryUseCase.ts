import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface IAddCategoryUseCase {
      add(name: string, description?: string): Promise<CategoryEntity>;
}
