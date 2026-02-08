import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface IgetCategoriesUseCase {
  getCategory(): Promise<CategoryEntity[]>;
}