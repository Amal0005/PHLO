import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { IBaseRepository } from "./IBaseRepository";

export interface CategoryFilterOptions {
  search?: string;
  sort?: "newest" | "oldest";
}
export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {
  findAllCategories(
    page: number,
    limit: number,
    filters?: CategoryFilterOptions,
  ): Promise<PaginatedResult<CategoryEntity>>;
  findByCategoryId(categoryId: string): Promise<CategoryEntity | null>;
  findByName(name: string): Promise<CategoryEntity | null>;
}
