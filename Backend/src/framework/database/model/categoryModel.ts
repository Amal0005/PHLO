import { CategoryEntity } from "@/domain/entities/categoryEntity";
import { model, Document, Types } from "mongoose";
import { categorySchema } from "../schema/categorySchema";

export interface ICategoryModel extends Omit<CategoryEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const CategoryModel = model<ICategoryModel>("Category", categorySchema);
