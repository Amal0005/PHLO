import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { ICategoryRepository } from "@/domain/interface/repository/ICategoryRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
  constructor(
    private categoryRepo: ICategoryRepository
  ) { }
  async delete(categoryId: string): Promise<void> {
    if (!categoryId) throw new Error(MESSAGES.ADMIN.CATEGORY_ID_REQUIRED);
    await this.categoryRepo.delete(categoryId);
  }
}

