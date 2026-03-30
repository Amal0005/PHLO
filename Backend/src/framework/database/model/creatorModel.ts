import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import { creatorSchema } from "@/framework/database/schema/creatorSchema";

export interface ICreatorModel extends Omit<CreatorEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const CreatorModel = model<ICreatorModel>("creator", creatorSchema);
