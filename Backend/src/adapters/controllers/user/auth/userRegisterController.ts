import { IUserRegisterUseCase } from "../../../../domain/interface/user/auth/IUserRegisterUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
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
        message: MESSAGES.AUTH.OTP_SENT,
      });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message,
      });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const email = req.body.email?.trim().toLowerCase()
      if (!email) return res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.AUTH.EMAIL_REQUIRED })
      await this._resendOtpUseCase.resend(email)

      return res.status(StatusCode.OK).json({ success: true, message: "Email Send Successfully" })

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.AUTH.SEND_OTP_FAILED;
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message
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
        message: MESSAGES.AUTH.OTP_VERIFIED,
        user
      });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.AUTH.INVALID_OTP;
      return res.status(StatusCode.OK).json({
        success: false,
        message
      });
    }
  }
}

