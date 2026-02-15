import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { CategoryModel, ICategoryModel } from "@/framework/database/model/categoryModel";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { paginateMongo } from "@/utils/pagination";
import { BaseRepository } from "../BaseRepository";
import { CategoryFilterOptions, ICategoryRepository } from "@/domain/interface/repositories/ICategoryRepository";

export class CategoryRepository extends BaseRepository<CategoryEntity, ICategoryModel> implements ICategoryRepository {
  constructor() {
    super(CategoryModel);
  }

  protected mapToEntity(doc: any): CategoryEntity {
    return { ...doc.toObject(), categoryId: doc._id.toString() };
  }

  // Inherited: findById, update, delete, create (automatically available!)

  // Explicit method to preserve basic findAll behavior
  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.model.find().sort({ createdAt: -1 });
    return categories.map(item => this.mapToEntity(item));
  }

  async findAllCategories(page: number, limit: number, filters?: CategoryFilterOptions): Promise<PaginatedResult<CategoryEntity>> {
    const query: any = {};
    if (filters?.search) query.name = { $regex: filters.search, $options: "i" };
    const sort: any = { createdAt: filters?.sort === 'oldest' ? 1 : -1 };
    const result = await paginateMongo(this.model, query, page, limit, { sort });
    return { ...result, data: result.data.map((item: any) => this.mapToEntity(item)) };
  }

  async findByCategoryId(categoryId: string): Promise<CategoryEntity | null> {
    const category = await this.model.findById(categoryId);
    return category ? this.mapToEntity(category) : null;
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const category = await this.model.findOne({ name });
    return category ? this.mapToEntity(category) : null;
  }
}
