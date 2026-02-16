import { IForgotPasswordUseCase } from "@/domain/interface/creator/auth/IForgotPasswordUseCase";
import { IVerifyForgotOtpUseCase } from "@/domain/interface/creator/auth/IVerifyForgotOtpUseCase";
import { IResetPasswordUseCase } from "@/domain/interface/creator/auth/IResetPasswordUseCase";

import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class CreatorAuthController {
    constructor(
        private _forgotPasswordUseCase: IForgotPasswordUseCase,
        private _verifyForgotOtpUseCase: IVerifyForgotOtpUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase
    ) { }

    async forgotPassword(req: Request, res: Response) {
        try {
            const email = req.body.email?.trim().toLowerCase();
            if (!email) {
                return res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.AUTH.EMAIL_REQUIRED });
            }
            await this._forgotPasswordUseCase.sendOtp(email);
            return res.status(StatusCode.OK).json({
                success: true,
                message: MESSAGES.AUTH.OTP_SENT,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.SEND_OTP_FAILED;
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message,
            });
        }
    }

    async verifyForgotOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            await this._verifyForgotOtpUseCase.verify(email, otp);
            return res.status(StatusCode.OK).json({ success: true, message: MESSAGES.AUTH.OTP_VERIFIED });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.INVALID_OTP;
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message,
            });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            await this._resetPasswordUseCase.reset(email, password);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.PASSWORD_RESET_FAILED;
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message,
            });
        }
    }

}

