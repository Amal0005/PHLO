import { CategoryMapper } from "@/application/mapper/admin/categoryMapper";
import type { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";
import type { IAdminCategoryListingUseCase } from "@/domain/interface/admin/IAdminCategoryListingUseCase";
import type { CategoryFilterOptions, ICategoryRepository } from "@/domain/interface/repository/ICategoryRepository";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export class AdminCategoryListingUseCase implements IAdminCategoryListingUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) {}
    async getAllCategories(page: number, limit: number, filters?: CategoryFilterOptions): Promise<PaginatedResult<CategoryResponseDto>> {
        const result = await this._categoryRepo.findAllCategories(page, limit, filters);
        return {
            ...result,
            data: result.data.map(cat => CategoryMapper.toDto(cat))
        };
    }
}

