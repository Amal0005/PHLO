import { CategoryEntity } from "@/domain/entities/categoryEntity";

export interface ICategoryRepository {
  create(category: CategoryEntity): Promise<CategoryEntity>;
  findAll(): Promise<CategoryEntity[]>;
  findByCategoryId(categoryId: string): Promise<CategoryEntity | null>;
  delete(categoryId: string): Promise<void>;
  update(categoryId: string,category: Partial<CategoryEntity>): Promise<CategoryEntity | null>;
  findByName(name: string): Promise<CategoryEntity | null>;
}
