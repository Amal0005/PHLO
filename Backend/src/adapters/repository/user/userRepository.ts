import { PaginatedResult } from "@/domain/types/paginationTypes";
import { User } from "../../../domain/entities/userEntities";
import { UserModel, IUserModel } from "../../../framework/database/model/userModel";
import { paginateMongo } from "@/utils/pagination";
import { BaseRepository } from "../baseRepository";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { Filter } from "mongodb";

export class UserRepository extends BaseRepository<User, IUserModel> implements IUserRepository {
  constructor() {
    super(UserModel);
  }




  async findByEmail(email: string): Promise<User | null> {
    const user = await this.model.findOne({ email });
    return user ? this.mapToEntity(user) : null;
  }

  async createUser(user: Omit<User, "_id">): Promise<User> {
    const created = await this.model.create(user as unknown as Omit<IUserModel, keyof Document>);
    return this.mapToEntity(created as IUserModel);
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.model.updateOne({ email }, { $set: { password: hashedPassword } });
  }

  async findAllUsers(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<User>> {
    const query: Filter<IUserModel> = { role: "user" };
    if (status && status !== "all") {
      query.status = status as "active" | "blocked";
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const result = await paginateMongo(this.model, query, page, limit, { select: "-password", sort: { createdAt: -1 } });
    return { ...result, data: result.data.map((user: IUserModel) => this.mapToEntity(user)) };
  }

  async updateUserStatus(userId: string, status: "active" | "blocked"): Promise<void> {
    await this.model.updateOne({ _id: userId }, { $set: { status: status } });
  }

  async findByPhone(phone: string | undefined): Promise<User | null> {
    if (!phone) return null;
    const user = await this.model.findOne({ phone });
    return user ? this.mapToEntity(user) : null;
  }

  async editProfile(userId: string, data: { name?: string; phone?: string; image?: string; }): Promise<User | null> {
    const user = await this.model.findByIdAndUpdate(userId, { $set: data }, { new: true }).select("-password");
    return user ? this.mapToEntity(user) : null;
  }

  protected mapToEntity(doc: IUserModel): User {
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
}
