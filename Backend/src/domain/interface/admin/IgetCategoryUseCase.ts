import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface IGetCategoryUseCase {
  getCategory(): Promise<CategoryEntity[]>;
}