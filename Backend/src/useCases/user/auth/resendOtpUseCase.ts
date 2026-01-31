import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IresendOtpUseCase } from "../../../domain/interface/user/auth/IresendOtpUseCase";
import redis from "../../../framework/redis/redisClient";


import { renderTemplate } from "../../../utils/renderTemplates";

export class ResendOtpUseCase implements IresendOtpUseCase {
  constructor(
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) { }

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

    const htmlTemplate = renderTemplate("user/otp.html", {
      TITLE: "Verification Code",
      MESSAGE: "Here is your new verification code",
      OTP_CODE: otp.toString(),
    });

    await this._mailService.sendMail(
      email,
      "Verify Your Account",
      htmlTemplate
    );

    await redis.set(resendKey, "1", { EX: 60 });
    await redis.set(countKey, (count + 1).toString(), { EX: 600 });
  }
}
