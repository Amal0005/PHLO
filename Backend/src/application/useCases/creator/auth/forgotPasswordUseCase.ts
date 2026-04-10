import type { IMailService } from "@/domain/interfaces/service/IMailServices";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IForgotPasswordUseCase } from "@/domain/interfaces/creator/auth/IForgotPasswordUseCase";
import { MESSAGES } from "@/constants/commonMessages";


import { renderTemplate } from "@/utils/renderTemplates";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";

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

