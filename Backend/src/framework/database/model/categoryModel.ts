import type { CategoryEntity } from "@/domain/entities/categoryEntity";
import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import { categorySchema } from "@/framework/database/schema/categorySchema";

export interface ICategoryModel extends Omit<CategoryEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const CategoryModel = model<ICategoryModel>("Category", categorySchema);
