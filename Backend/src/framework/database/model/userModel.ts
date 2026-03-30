import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { User } from "@/domain/entities/userEntities";
import { userSchema } from "@/framework/database/schema/userSchema";

export interface IUserModel extends Omit<User, "_id">, Document {
  _id: Types.ObjectId;
}


export const UserModel = model<IUserModel>("user", userSchema);
