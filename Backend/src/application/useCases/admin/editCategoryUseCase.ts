import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";
import { MESSAGES } from "@/utils/commonMessages";

export class EditCategoryUseCase implements IEditCategoryUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) {}
    async edit(categoryId: string, name: string, description?: string): Promise<CategoryEntity | null> {
        if (!categoryId) throw new Error(MESSAGES.ADMIN.CATEGORY_ID_REQUIRED);
        if (!name) throw new Error(MESSAGES.ADMIN.CATEGORY_NAME_REQUIRED);
        const existing = await this._categoryRepo.findByName(name)
        if (existing && existing.categoryId !== categoryId) throw new Error(MESSAGES.ADMIN.CATEGORY_ALREADY_EXISTS);
        return await this._categoryRepo.update(categoryId, { name, description })
    }
}
