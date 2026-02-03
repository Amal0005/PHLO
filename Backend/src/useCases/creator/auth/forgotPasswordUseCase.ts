import { IMailService } from "@/domain/interface/service/ImailServices";
import { IOTPService } from "@/domain/interface/service/IotpServices";
import { IforgotPasswordUseCase } from "@/domain/interface/creator/auth/IforgotPasswordUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";


import { renderTemplate } from "@/utils/renderTemplates";

export class ForgotPasswordUseCase implements IforgotPasswordUseCase {
    constructor(
        private _creatorRepo: IcreatorRepository,
        private _otpService: IOTPService,
        private _mailService: IMailService
    ) {}

    async sendOtp(email: string): Promise<void> {
        email = email.trim().toLowerCase();
        const creator = await this._creatorRepo.findByEmail(email);
        if (!creator) throw new Error("This creator does not exist");

        const otp = await this._otpService.generateOtp(`FP_CREATOR_${email}`);
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
