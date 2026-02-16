import { IMailService } from "@/domain/interface/service/IMailServices";
import { IOTPService } from "@/domain/interface/service/IOtpServices";
import { IForgotPasswordUseCase } from "@/domain/interface/creator/auth/IForgotPasswordUseCase";
import { MESSAGES } from "@/utils/commonMessages";


import { renderTemplate } from "@/utils/renderTemplates";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _otpService: IOTPService,
        private _mailService: IMailService
    ) {}

    async sendOtp(email: string): Promise<void> {
        email = email.trim().toLowerCase();
        const creator = await this._creatorRepo.findByEmail(email);
        if (!creator) throw new Error(MESSAGES.CREATOR.NOT_FOUND);

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

