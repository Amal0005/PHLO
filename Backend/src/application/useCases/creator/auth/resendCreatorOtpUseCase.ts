import type { IMailService } from "@/domain/interfaces/service/IMailServices";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IResendCreatorOtpUseCase } from "@/domain/interfaces/creator/register/IResendCreatorOtpUseCase";
import { renderTemplate } from "@/utils/renderTemplates";

export class ResendCreatorOtpUseCase implements IResendCreatorOtpUseCase {
    constructor(
        private _otpService: IOTPService,
        private _mailService: IMailService
    ) {}

    async resendOtp(email: string): Promise<void> {
        email = email.trim().toLowerCase();

        const otp = await this._otpService.generateOtp(email);

        const htmlTemplate = renderTemplate("user/otp.html", {
            TITLE: "Verify Your Email",
            MESSAGE: "Enter the verification code to complete your creator registration",
            OTP_CODE: otp.toString(),
        });

        await this._mailService.sendMail(
            email,
            "Verify Your Creator Account",
            htmlTemplate
        );
    }
}

