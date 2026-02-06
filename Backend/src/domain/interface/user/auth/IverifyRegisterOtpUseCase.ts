import { User } from "../../../entities/userEntities";

export interface IverifyRegisterOtpUseCase {
  verifyUser(email: string, otp: string): Promise<User>;
}
