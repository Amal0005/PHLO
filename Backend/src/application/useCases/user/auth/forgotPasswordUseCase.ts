import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IMailService } from "@/domain/interfaces/service/IMailServices";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IForgotPasswordUseCase } from "@/domain/interfaces/user/auth/IForgotPasswordUseCase";

import { renderTemplate } from "@/utils/renderTemplates";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) {}

  async sendOtp(email: string): Promise<void> {
    email = email.trim().toLowerCase();
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("This user does not exists");
    const otp = await this._otpService.generateOtp(`FP_${email}`)

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

