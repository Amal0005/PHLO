import { User } from "../../../domain/entities/userEntities";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IPendingUserService } from "../../../domain/interface/service/IpendingUserService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IverifyRegisterOtpUseCase } from "../../../domain/interface/user/auth/IverifyRegisterOtpUseCase";

export class verifyRegisterOtpUseCase implements IverifyRegisterOtpUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _otpService: IOTPService,
    private _pendingUser: IPendingUserService
  ) {}
  async verifyUser(email: string, otp: string): Promise<User> {
    email = email.trim().toLowerCase();
    const result = await this._otpService.verifyOtp(email, otp);
    if (result == "EXPIRED") throw new Error("Otp expired");
    if (result == "INVALID") throw new Error("Invalid Otp");
    const pending = await this._pendingUser.getPending(email);
    if (!pending) throw new Error("Time Expired");
    const userData = JSON.parse(pending);
    const createdUser = await this._userRepo.createUser(userData);
    await this._pendingUser.deletePending(email);
    return createdUser;
  }
}
