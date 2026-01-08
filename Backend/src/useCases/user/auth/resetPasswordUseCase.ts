import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IresetPasswordUseCase } from "../../../domain/interface/user/auth/IresetPasswordUseCase";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import redis from "../../../framework/redis/redisClient";

export class ResetPasswordUseCase implements IresetPasswordUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _passwordService: IpasswordService
  ) {}

  async reset(email: string, newPassword: string): Promise<void> {
    email = email.trim().toLowerCase();
    const verified = await redis.get(`FP_VERIFIED_${email}`);
    if (!verified) throw new Error("OTP not verified");

    const hashed = await this._passwordService.hash(newPassword);
    await this._userRepo.updatePassword(email, hashed);

    await redis.del(`FP_VERIFIED_${email}`);
    await redis.del(`OTP_FP_${email}`);
  }
}
