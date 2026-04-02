import type { CategoryEntity } from "@/domain/entities/categoryEntity";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { IBaseRepository } from "@/domain/interfaces/repository/IBaseRepository";

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
