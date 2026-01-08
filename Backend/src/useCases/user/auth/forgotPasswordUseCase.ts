import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IforgotPasswordUseCase } from "../../../domain/interface/user/auth/IforgotPasswordUseCase";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import redis from "../../../framework/redis/redisClient";

export class ForgotPasswordUseCase implements IforgotPasswordUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) {}

  async sendOtp(email: string): Promise<void> {
    email = email.trim().toLowerCase();
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("This user does not exists");
    const cooldownKey = `FP_COOLDOWN_${email}`;
    const otpKey = `FP_OTP_${email}`;

    const cooldown=await redis.ttl(cooldownKey)
    if(cooldown>0) throw new Error(`Please wait ${cooldown} seconds before requesting again`)

        const otp=await this._otpService.generateOtp(`FP_${email}`) 
console.log(otp);

   await this._mailService.sendMail(
      email,
      "Reset Your Password",
      `<h2>Password Reset OTP</h2>
       <p style="font-size:18px;font-weight:bold">${otp}</p>
       <p>This OTP expires in 1 minutes.</p>`
    );
    await redis.set(cooldownKey,"1",{EX:60})
  }
}
