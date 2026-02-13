import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { ICategoryRepository } from "@/domain/interface/admin/ICategoryRepository";
import { IgetCategoriesUseCase } from "@/domain/interface/admin/IGetCategoryUseCase";

export class GetCategoryUseCase implements IgetCategoriesUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) { }
    async getCategory(): Promise<CategoryEntity[]> {
        const categories = await this._categoryRepo.findAll()
        return categories
    }
}
