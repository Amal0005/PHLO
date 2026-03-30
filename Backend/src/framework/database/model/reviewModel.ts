import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { ReviewEntity } from "@/domain/entities/reviewEntity";
import { ReviewSchema } from "@/framework/database/schema/reviewSchema";

export interface IReviewModel extends Omit<ReviewEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const ReviewModel = model<IReviewModel>("Review", ReviewSchema);
