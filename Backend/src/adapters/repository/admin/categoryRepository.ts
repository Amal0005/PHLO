import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { ICategoryRepository } from "@/domain/interface/admin/IcategoryRepository";
import { CategoryModel } from "@/framework/database/model/categoryModel";

export class CategoryRepository implements ICategoryRepository{

    async create(category: CategoryEntity): Promise<CategoryEntity> {
        const created=await CategoryModel.create(category)
        return {...created.toObject(),categoryId:created._id.toString()}
    }
    async findAll(): Promise<CategoryEntity[]> {
        const categories=await CategoryModel.find().sort({createdAt:-1})
        return categories.map(item=>({...item.toObject(),categoryId:item._id.toString()}))
    }
    async findByCategoryId(categoryId: string): Promise<CategoryEntity | null> {
        const category=await CategoryModel.findById(categoryId)
        return category?{...category.toObject(),categoryId:category._id.toString()}:null
    }
    async delete(categoryId: string): Promise<void> {
        await CategoryModel.findByIdAndDelete(categoryId)
    }
    async update(categoryId: string, category: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
        await CategoryModel.updateOne({_id:categoryId},{$set:category})
        return await CategoryModel.findById(categoryId);
    }
    async findByName(name: string): Promise<CategoryEntity | null> {
         const category = await CategoryModel.findOne({ name });
        if (!category) return null;
        return { ...category.toObject(), categoryId: category._id.toString() };
    }
}