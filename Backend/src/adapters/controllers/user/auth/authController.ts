import { IforgotPasswordUseCase } from "../../../../domain/interface/user/auth/IforgotPasswordUseCase";
import { IVerifyForgotOtpUseCase } from "../../../../domain/interface/user/auth/IverifyForgotOtpUseCase";
import { IresetPasswordUseCase } from "../../../../domain/interface/user/auth/IresetPasswordUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class UserAuthController {
  constructor(
    private _forgotPasswordUseCase: IforgotPasswordUseCase,
    private _verifyForgotOtpUseCase: IVerifyForgotOtpUseCase,
    private _resetPasswordUseCase: IresetPasswordUseCase
  ) { }

  async forgotPassword(req: Request, res: Response) {
    try {
      const email = req.body.email?.trim().toLowerCase()
      if (!email) {
        return res.status(StatusCode.BAD_REQUEST).json({ message: "Email required" });

      }
      await this._forgotPasswordUseCase.sendOtp(email)
      return res.status(StatusCode.OK).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error?.message || "Failed to send OTP",
      });
    }
  }

  async verifyForgotOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body
      await this._verifyForgotOtpUseCase.verify(email, otp)
      return res.status(StatusCode.OK).json({ success: true, message: "Otp Verified" })
    } catch (error: any) {
      return res.status(StatusCode.OK).json({
        success: false,
        message: error?.message || "Invalid OTP",
      });
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      await this._resetPasswordUseCase.reset(email, password)
      return res.status(StatusCode.OK).json({ success: true, message: "Password Reset Successful" });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error?.message || "Failed to reset password",
      });
    }
  }
}


