import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { IaddCategoryUseCase } from "@/domain/interface/admin/IaddCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/admin/IcategoryRepository";

export class AddCategoryUseCase implements IaddCategoryUseCase{
    constructor(
        private _categoryRepo:ICategoryRepository
    ){}
    async add(name: string, description?: string): Promise<CategoryEntity> {
        if(!name)throw new Error("Name is required")
        const category=await this._categoryRepo.create({name,description})
    return category
    }
}