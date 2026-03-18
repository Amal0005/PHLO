import { CategoryMapper } from "@/application/mapper/admin/categoryMapper";
import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";
import { ICategoryRepository } from "@/domain/interface/repository/ICategoryRepository";
import { MESSAGES } from "@/constants/commonMessages";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/constants/statusCodes";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";

export class EditCategoryUseCase implements IEditCategoryUseCase {
    constructor(
        private _categoryRepo: ICategoryRepository
    ) {}
    async edit(categoryId: string, name: string, description?: string): Promise<CategoryResponseDto | null> {
        if (!categoryId) throw new AppError(MESSAGES.ADMIN.CATEGORY_ID_REQUIRED, StatusCode.BAD_REQUEST);
        if (!name) throw new AppError(MESSAGES.ADMIN.CATEGORY_NAME_REQUIRED, StatusCode.BAD_REQUEST);
        const existing = await this._categoryRepo.findByName(name)
        if (existing && existing.id !== categoryId) throw new AppError(MESSAGES.ADMIN.CATEGORY_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
        const updated = await this._categoryRepo.update(categoryId, { name, description });
        return updated ? CategoryMapper.toDto(updated) : null;
    }
}
