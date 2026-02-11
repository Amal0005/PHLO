export interface IDeleteCategoryUseCase {
  delete(categoryId: string): Promise<void>;
}

