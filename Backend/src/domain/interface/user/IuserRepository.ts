import { User } from "../../entities/userEntities";

export interface IuserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, "_id">): Promise<User>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
    findAllUsers(): Promise<User[]>;

}
