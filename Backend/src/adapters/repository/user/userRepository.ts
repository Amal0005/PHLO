import { PaginatedResult } from "@/domain/types/paginationTypes";
import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { UserModel } from "../../../framework/database/model/userModel";
import { paginateMongo } from "@/utils/pagination";
import { UserMapper } from "../../mapper/user/userMapper";

export class UserRepository implements IuserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  async createUser(user: Omit<User, "_id">): Promise<User> {
    const created = await UserModel.create(user);
    return UserMapper.toDomain(created);
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } },
    );
  }
  async findAllUsers(
    page: number,
    limit: number
  ): Promise<PaginatedResult<User>> {

    const result = await paginateMongo(
      UserModel,
      { role: "user" },
      page,
      limit,
      {
        select: "-password",
        sort: { createdAt: -1 }
      }
    );
    return {
      ...result,
      data: result.data.map((user: any) =>
        UserMapper.toDomain(user.toObject())
      )
    };
  }

  async updateUserStatus(userId: string, status: "active" | "blocked"): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: { status: status } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return UserMapper.toDomain(user);
  }
  async findByPhone(phone: string): Promise<User | null> {
    const user = await UserModel.findOne({ phone });
    if (!user) return null;
    return UserMapper.toDomain(user);
  }
  async editProfile(userId: string, data: { name?: string; phone?: string; image?: string; }): Promise<User | null> {
    console.log("jg",data, typeof data.name);
    
  const user=await UserModel.findByIdAndUpdate(userId, { $set: data },{ new: true }).select("-password");
    if(!user)return null
    return UserMapper.toDomain(user)
  }
}
