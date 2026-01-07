import { User } from "../../entities/userEntities";

export interface IuserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
}
