import { IUserRegisterUseCase } from "../../../../domain/interface/user/auth/IUserRegisterUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IVerifyRegisterOtpUseCase } from "../../../../domain/interface/user/auth/IVerifyRegisterOtpUseCase";
import { IResendOtpUseCase } from "../../../../domain/interface/user/auth/IResendOtpUseCase";

export class userRegisterController {
  constructor(
    private _userRegisterUseCase: IUserRegisterUseCase,
    private _verifyOtpUseCase: IVerifyRegisterOtpUseCase,
    private _resendOtpUseCase: IResendOtpUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const userInput = req.body;

      await this._userRegisterUseCase.registerUser(userInput);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "OTP sent to email. Please verify to complete registration.",
      });

    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const email = req.body.email?.trim().toLowerCase()
      if (!email) return res.status(StatusCode.BAD_REQUEST).json({ message: "Email Required" })
      await this._resendOtpUseCase.resend(email)

      return res.status(StatusCode.OK).json({ success: true, message: "Email Send Successfully" })

    } catch (error) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: "Failed to resend OTP"
      })

    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const email = req.body.email.trim().toLowerCase();
      const otp = String(req.body.otp);

      const user = await this._verifyOtpUseCase.verifyUser(
        email,
        otp
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: "User Verified Successfully",
        user
      });

    } catch (error: any) {
      return res.status(StatusCode.OK).json({
        success: false,
        message: error?.message || "OTP Verification Failed"
      });
    }
  }
}

