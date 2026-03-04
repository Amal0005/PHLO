import { model, Document, Types } from "mongoose";
import { ReviewEntity } from "@/domain/entities/reviewEntity";
import { ReviewSchema } from "../schema/reviewSchema";

export interface IReviewModel extends Omit<ReviewEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const ReviewModel = model<IReviewModel>("Review", ReviewSchema);
