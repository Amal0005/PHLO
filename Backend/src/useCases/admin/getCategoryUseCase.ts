import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { IGetCategoryUseCase } from "@/domain/interface/admin/IGetCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";

export class GetCategoryUseCase implements IGetCategoryUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) {}
    async getCategory(): Promise<CategoryEntity[]> {
        const categories = await this._categoryRepo.findAll()
        return categories
    }
}
