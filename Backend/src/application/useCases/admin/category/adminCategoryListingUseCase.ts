import { CategoryMapper } from "@/application/mapper/admin/categoryMapper";
import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";
import { IAdminCategoryListingUseCase } from "@/domain/interface/admin/category/IAdminCategoryListingUseCase";
import { CategoryFilterOptions, ICategoryRepository } from "@/domain/interface/repository/ICategoryRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

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

