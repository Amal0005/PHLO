import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IresendOtpUseCase } from "../../../domain/interface/user/auth/IresendOtpUseCase";
import redis from "../../../framework/redis/redisClient";


export class ResendOtpUseCase implements IresendOtpUseCase {
  constructor(
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) {}

  async resend(email: string): Promise<void> {
      email = email.trim().toLowerCase();

    const resendKey = `RESEND_${email}`;
    const countKey = `RESEND_COUNT_${email}`;

    const cooldown = await redis.ttl(resendKey);
    if (cooldown > 0) {
      throw new Error(`Wait ${cooldown} seconds before resending OTP`);
    }

    const count = Number((await redis.get(countKey)) || 0);
    if (count >= 3) {
      throw new Error("Max resend attempts reached");
    }

    const otp = await this._otpService.generateOtp(email);
    console.log(otp);
    
    await this._mailService.sendMail(
      email,
      "Verify Your Account",
      `<h2>Your OTP Code</h2>
       <p style="font-size:18px;font-weight:bold">${otp}</p>
       <p>This OTP expires in 2 minutes.</p>`
    );

    // Set Cooldown & Count
    await redis.set(resendKey, "1", { EX: 60 });      // 60 seconds cooldown
    await redis.set(countKey, (count + 1).toString(), { EX: 600 }); // resets after 10 mins
  }
}
