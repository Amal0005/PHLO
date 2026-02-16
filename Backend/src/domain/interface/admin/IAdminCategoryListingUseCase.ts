import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CategoryFilterOptions } from "../repositories/ICategoryRepository";

export interface IAdminCategoryListingUseCase {
    getAllCategories(
        page: number,
        limit: number,
        filters?: CategoryFilterOptions
    ): Promise<PaginatedResult<CategoryEntity>>;
}
