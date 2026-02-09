import { ICategoryRepository } from "@/domain/interface/admin/IcategoryRepository";
import { IdeleteCategoryUseCase } from "@/domain/interface/admin/IdeleteCategoryUseCase";

export class DeleteCategoryUseCase implements IdeleteCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}
  async delete(categoryId: string): Promise<void> {
    if (!categoryId) throw new Error("Category ID is required");
    await this.categoryRepo.delete(categoryId);
  }
}
