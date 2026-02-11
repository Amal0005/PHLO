import { IMailService } from "@/domain/interface/service/IMailServices";
import { IOTPService } from "@/domain/interface/service/IOtpServices";
import { IResendCreatorOtpUseCase } from "@/domain/interface/creator/register/IResendCreatorOtpUseCase";
import { renderTemplate } from "@/utils/renderTemplates";

export class ResendCreatorOtpUseCase implements IResendCreatorOtpUseCase {
    constructor(
        private _otpService: IOTPService,
        private _mailService: IMailService
    ) {}

    async resendOtp(email: string): Promise<void> {
        email = email.trim().toLowerCase();

        const otp = await this._otpService.generateOtp(email);
        console.log("CreatorOTP:", otp);

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

