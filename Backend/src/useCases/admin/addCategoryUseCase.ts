import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";
import { MESSAGES } from "@/utils/commonMessages";

export class AddCategoryUseCase implements IAddCategoryUseCase {
  constructor(
    private _categoryRepo: ICategoryRepository

  ) {}
  async add(name: string, description?: string): Promise<CategoryEntity> {
    if (!name) throw new Error(MESSAGES.ADMIN.CATEGORY_NAME_REQUIRED);
    const existed = await this._categoryRepo.findByName(name);
    if (existed) throw new Error(MESSAGES.ADMIN.CATEGORY_ALREADY_EXISTS);
    const category = await this._categoryRepo.create({ name, description });
    return category;
  }
}

