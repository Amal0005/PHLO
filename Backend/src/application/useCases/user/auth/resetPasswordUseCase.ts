import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IPasswordService } from "@/domain/interfaces/service/IPasswordService";
import type { IRedisService } from "@/domain/interfaces/service/IRedisServices";
import type { IResetPasswordUseCase } from "@/domain/interfaces/user/auth/IResetPasswordUseCase";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _passwordService: IPasswordService,
    private _redisService: IRedisService
  ) {}

  async reset(email: string, newPassword: string): Promise<void> {
    email = email.trim().toLowerCase();
    const verified = await this._redisService.getValue(`FP_VERIFIED_${email}`);
    if (!verified) throw new Error("OTP not verified");

    const hashed = await this._passwordService.hash(newPassword);
    await this._userRepo.updatePassword(email, hashed);

    await this._redisService.deleteValue(`FP_VERIFIED_${email}`);
    await this._redisService.deleteValue(`OTP_FP_${email}`);
  }
}

