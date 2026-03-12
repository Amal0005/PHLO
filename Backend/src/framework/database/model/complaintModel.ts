import { model, Document, Types } from "mongoose";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { ComplaintSchema } from "../schema/complaintSchema";

export interface IComplaintModel extends Omit<ComplaintEntity, "_id">, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ComplaintModel = model<IComplaintModel>("complaint", ComplaintSchema);
