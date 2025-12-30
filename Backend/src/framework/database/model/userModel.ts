import { model, ObjectId,Types  } from "mongoose";
import { User } from "../../../domain/entities/userEntities";
import { userSchema } from "../schema/userSchema";

export interface IUserModel extends Omit<User, "_id">, Document {
  _id:Types.ObjectId;
}


export const UserModel = model<IUserModel>("user", userSchema);

