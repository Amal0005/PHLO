import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { CategoryFilterOptions } from "@/domain/interface/repository/ICategoryRepository";
import type { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";

export interface IAdminCategoryListingUseCase {
    getAllCategories(
        page: number,
        limit: number,
        filters?: CategoryFilterOptions
    ): Promise<PaginatedResult<CategoryResponseDto>>;
}
