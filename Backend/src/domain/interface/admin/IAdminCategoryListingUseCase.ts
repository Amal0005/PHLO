import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { ICategoryRepository, CategoryFilterOptions } from "@/domain/interface/admin/ICategoryRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IAdminCategoryListingUseCase {
    getAllCategories(
        page: number,
        limit: number,
        filters?: CategoryFilterOptions
    ): Promise<PaginatedResult<CategoryEntity>>;
}
