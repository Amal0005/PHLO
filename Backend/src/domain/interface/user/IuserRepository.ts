import { PaginatedResult } from "@/domain/types/paginationTypes";
import { User } from "../../entities/userEntities";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, "_id">): Promise<User>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  findAllUsers(page: number, limit: number): Promise<PaginatedResult<User>>
  updateUserStatus(userId: string, status: "active" | "blocked"): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string | undefined): Promise<User | null>
  editProfile(userId: string,data:{
    name?: string;
    phone?: string;
    image?: string;
  }
): Promise<User | null>;

}

