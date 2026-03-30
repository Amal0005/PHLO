import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { PackageEntity } from "@/domain/entities/packageEntity";
import { packageSchema } from "@/framework/database/schema/packageSchema";

export interface IPackageModel extends Omit<PackageEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const PackageModel = model<IPackageModel>("package", packageSchema);
