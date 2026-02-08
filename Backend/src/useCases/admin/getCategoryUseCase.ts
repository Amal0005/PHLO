import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { ICategoryRepository } from "@/domain/interface/admin/IcategoryRepository";
import { IgetCategoriesUseCase } from "@/domain/interface/admin/IgetCategoryUseCase";

export class GetCategoryUseCase implements IgetCategoriesUseCase{
    constructor(
        private _categoryRepo:ICategoryRepository
    ){}
    async getCategory(): Promise<CategoryEntity[]> {
        const categories=await this._categoryRepo.findAll()
        return categories
    }
}