import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CategoryFilterOptions } from "../../repository/ICategoryRepository";
import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";

export interface IAdminCategoryListingUseCase {
    getAllCategories(
        page: number,
        limit: number,
        filters?: CategoryFilterOptions
    ): Promise<PaginatedResult<CategoryResponseDto>>;
}
