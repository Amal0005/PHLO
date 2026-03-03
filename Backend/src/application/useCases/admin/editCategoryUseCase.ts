import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";
import { MESSAGES } from "@/utils/commonMessages";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/utils/statusCodes";

export class EditCategoryUseCase implements IEditCategoryUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) {}
    async edit(categoryId: string, name: string, description?: string): Promise<CategoryEntity | null> {
        if (!categoryId) throw new AppError(MESSAGES.ADMIN.CATEGORY_ID_REQUIRED, StatusCode.BAD_REQUEST);
        if (!name) throw new AppError(MESSAGES.ADMIN.CATEGORY_NAME_REQUIRED, StatusCode.BAD_REQUEST);
        const existing = await this._categoryRepo.findByName(name)
        if (existing && existing.categoryId !== categoryId) throw new AppError(MESSAGES.ADMIN.CATEGORY_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
        return await this._categoryRepo.update(categoryId, { name, description })
    }
}
