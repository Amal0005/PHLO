import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/admin/ICategoryRepository";

export class AddCategoryUseCase implements IAddCategoryUseCase {
  constructor(private _categoryRepo: ICategoryRepository) {}
  async add(name: string, description?: string): Promise<CategoryEntity> {
    if (!name) throw new Error("Name is required");
    const existed = await this._categoryRepo.findByName(name);
    if (existed) throw new Error("The Category already existed");
    const category = await this._categoryRepo.create({ name, description });
    return category;
  }
}

