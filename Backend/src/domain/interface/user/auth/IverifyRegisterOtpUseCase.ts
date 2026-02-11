import { User } from "../../../entities/userEntities";

export interface IVerifyRegisterOtpUseCase {
  verifyUser(email: string, otp: string): Promise<User>;
}

