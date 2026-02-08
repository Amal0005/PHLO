import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface ICategoryRepository {
  create(category: CategoryEntity): Promise<CategoryEntity>;
  findAll(): Promise<CategoryEntity[]>;
  findByCategoryId(categoryId: string): Promise<CategoryEntity | null>;
  delete(categoryId: string): Promise<void>;
}