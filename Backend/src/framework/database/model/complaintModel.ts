import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { ComplaintSchema } from "@/framework/database/schema/complaintSchema";

export interface IComplaintModel extends Omit<ComplaintEntity, "_id">, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ComplaintModel = model<IComplaintModel>("complaint", ComplaintSchema);
