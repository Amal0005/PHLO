import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { ICategoryRepository } from "@/domain/interface/admin/ICategoryRepository";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";

export class EditCategoryUseCase implements IEditCategoryUseCase{
    constructor(
        private _categoryRepo:ICategoryRepository
    ){}
    async edit(categoryId: string, name: string, description?: string): Promise<CategoryEntity | null> {
        if(!categoryId)throw new Error("Category id is required")
            if(!name)throw new Error("Name is required")
            const existing=await this._categoryRepo.findByName(name)
        if(existing&&existing.categoryId!==categoryId)throw new Error("The Category already existedd")
            return await this._categoryRepo.update(categoryId,{name,description})
    }
}
