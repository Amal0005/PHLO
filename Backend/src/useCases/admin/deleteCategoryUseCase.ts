import { ICategoryRepository } from "@/domain/interface/admin/ICategoryRepository";
import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}
  async delete(categoryId: string): Promise<void> {
    if (!categoryId) throw new Error("Category ID is required");
    await this.categoryRepo.delete(categoryId);
  }
}

