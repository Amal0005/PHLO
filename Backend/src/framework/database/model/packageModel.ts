import { model, Document, Types } from "mongoose";
import { PackageEntity } from "@/domain/entities/packageEntity";
import { packageSchema } from "../schema/packageSchema";

export interface IPackageModel extends Omit<PackageEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const PackageModel = model<IPackageModel>("package", packageSchema);
