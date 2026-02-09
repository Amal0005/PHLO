export interface IdeleteCategoryUseCase {
  delete(categoryId: string): Promise<void>;
}
