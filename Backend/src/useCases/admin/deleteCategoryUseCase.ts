import { ICategoryRepository } from "@/domain/interface/admin/ICategoryRepository";
import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { MESSAGES } from "@/utils/commonMessages";

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) { }
  async delete(categoryId: string): Promise<void> {
    if (!categoryId) throw new Error(MESSAGES.ADMIN.CATEGORY_ID_REQUIRED);
    await this.categoryRepo.delete(categoryId);
  }
}

