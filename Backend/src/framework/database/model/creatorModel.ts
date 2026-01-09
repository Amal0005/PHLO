import { model, Types } from "mongoose";
import { CreatorEntity } from "../../../domain/entities/creatorEntities";
import { creatorSchema } from "../schema/creatorSchema";


export interface ICreatorModel extends Omit<CreatorEntity, "_id">,Document {
  _id: Types.ObjectId;
}

export const CreatorModel = model<ICreatorModel>("creator",creatorSchema );
