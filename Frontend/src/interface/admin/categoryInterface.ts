export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface CategoryForm {
  name: string;
  description?: string;
}
