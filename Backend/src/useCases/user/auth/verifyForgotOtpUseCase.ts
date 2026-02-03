import { IRedisService } from "../../../domain/interface/service/IredisServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IVerifyForgotOtpUseCase } from "../../../domain/interface/user/auth/IverifyForgotOtpUseCase";

export class VerifyForgotOtpUseCase implements IVerifyForgotOtpUseCase {
  constructor(
    private _otpService: IOTPService,
    private _redisService: IRedisService
  ) {}
  async verify(email: string, otp: string): Promise<void> {
    email = email.trim().toLowerCase();
    const status = await this._otpService.verifyOtp(`FP_${email}`, otp);
    if (status === "EXPIRED") throw new Error("OTP expired");
    if (status === "INVALID") throw new Error("Invalid OTP");

    await this._redisService.setValue(`FP_VERIFIED_${email}`, "1", 300);

  }
}
