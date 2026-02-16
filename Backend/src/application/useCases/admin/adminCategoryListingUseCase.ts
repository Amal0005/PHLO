import { IAdminCategoryListingUseCase } from "@/domain/interface/admin/IAdminCategoryListingUseCase";
import { CategoryFilterOptions, ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";


export class AdminCategoryListingUseCase implements IAdminCategoryListingUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) {}
    async getAllCategories(page: number, limit: number, filters?: CategoryFilterOptions) {
        return this._categoryRepo.findAllCategories(page, limit, filters);
    }
}

