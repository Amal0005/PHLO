import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IforgotPasswordUseCase } from "../../../domain/interface/user/auth/IforgotPasswordUseCase";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import redis from "../../../framework/redis/redisClient";

import { renderTemplate } from "../../../utils/renderTemplates";

export class ForgotPasswordUseCase implements IforgotPasswordUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) { }

  async sendOtp(email: string): Promise<void> {
    email = email.trim().toLowerCase();
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("This user does not exists");
    const otp = await this._otpService.generateOtp(`FP_${email}`)
    console.log(otp);

    const htmlTemplate = renderTemplate("user/otp.html", {
      TITLE: "Password Reset OTP",
      MESSAGE: "Use the code below to reset your password",
      OTP_CODE: otp.toString(),
    });

    await this._mailService.sendMail(
      email,
      "Reset Your Password",
      htmlTemplate
    );
  }
}
