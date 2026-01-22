import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { UserModel } from "../../../framework/database/model/userModel";

export class UserRepository implements IuserRepository {

  private toDomain(doc: any): User {

    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      googleId: doc.googleId,
      image: doc.image,
      status: doc.status,
      role: doc.role,
      googleVerified: doc.googleVerified,
      createdAt: doc.createdAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return this.toDomain(user);
  }

  async createUser(user: Omit<User, "_id">): Promise<User> {
    const created = await UserModel.create(user);
    return this.toDomain(created);
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
  }
    async findAllUsers(): Promise<User[]> {
    const users = await UserModel.find({role:"user"})
      .select("-password")
      .sort({ createdAt: -1 });

    return users.map(user => this.toDomain(user));
  }
}
