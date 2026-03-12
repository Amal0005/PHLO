import { CategoryMapper } from "@/application/mapper/admin/categoryMapper";
import { CategoryResponseDto } from "@/domain/dto/admin/categoryResponseDto";
import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";
import { MESSAGES } from "@/constants/commonMessages";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/constants/statusCodes";

export class AddCategoryUseCase implements IAddCategoryUseCase {
  constructor(
    private _categoryRepo: ICategoryRepository
  ) { }
  async add(name: string, description?: string): Promise<CategoryResponseDto> {
    if (!name) throw new AppError(MESSAGES.ADMIN.CATEGORY_NAME_REQUIRED, StatusCode.BAD_REQUEST);
    const existed = await this._categoryRepo.findByName(name);
    if (existed) throw new AppError(MESSAGES.ADMIN.CATEGORY_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    const category = await this._categoryRepo.create({ name, description });
    return CategoryMapper.toDto(category);
  }
}

