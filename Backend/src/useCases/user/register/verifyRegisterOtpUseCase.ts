import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IverifyRegisterOtpUseCase } from "../../../domain/interface/user/register/IverifyRegisterOtpUseCase";
import redis from "../../../framework/redis/redisClient";

export class verifyRegisterOtpUseCase implements IverifyRegisterOtpUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _otpService: IOTPService
  ) {}
  async verifyUser(email: string, otp: string) {
    email = email.trim().toLowerCase();
    const otpRes = await this._otpService.verifyOtp(email, otp);
    if (otpRes === "OTP Expired") {
      throw new Error("OTP expired. Please request a new one");
    }
    if (otpRes === "Invalid OTP") {
      throw new Error("Incorrect OTP");
    }
    if (otpRes !== "OTP Verified") {
      throw new Error("OTP verification failed");
    }
    const pending = await redis.get(`PENDING_USER_${email}`);
    if (!pending) throw new Error("Registration Time Expires");
    const userData = JSON.parse(pending);
    const createdUser = await this._userRepo.createUser(userData);
    await redis.del(`PENDING_USER_${email}`);
    return createdUser;
  }
}
