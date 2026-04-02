import type { IMailService } from "@/domain/interfaces/service/IMailServices";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IResendOtpUseCase } from "@/domain/interfaces/user/auth/IResendOtpUseCase";


import { renderTemplate } from "@/utils/renderTemplates";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) {}

  async resend(email: string): Promise<void> {
    email = email.trim().toLowerCase();

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
  }
}

