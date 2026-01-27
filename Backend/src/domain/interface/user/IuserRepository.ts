import { User } from "../../entities/userEntities";

export interface IuserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, "_id">): Promise<User>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  findAllUsers(): Promise<User[]>;
  updateUserStatus(userId: string, status: "active" | "blocked"): Promise<void>;
  findById(id: string): Promise<User | null>;
}
