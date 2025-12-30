import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { UserModel } from "../../../framework/database/model/userModel";

export class userRepository implements IuserRepository {

     private toDomain(doc: any): User {
    return {
      ...doc,
      _id: doc._id.toString(),  
    };
  }
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }
async createUser(user: Omit<User, "_id">): Promise<User> {
  const created = await UserModel.create(user);
   return this.toDomain(created.toObject());
}

}
