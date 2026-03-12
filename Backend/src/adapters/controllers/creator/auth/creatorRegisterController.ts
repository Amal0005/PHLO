import { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import { IRegisterCreatorUseCase } from "@/domain/interface/creator/register/IRegisterCreatorUseCase";
import { ICheckCreatorExistsUseCase } from "@/domain/interface/creator/register/ICheckCreatorExistsUseCase";
import { IVerifyCreatorOtpUseCase } from "@/domain/interface/creator/register/IVerifyCreatorOtpUseCase";
import { IResendCreatorOtpUseCase } from "@/domain/interface/creator/register/IResendCreatorOtpUseCase";

export class CreatorRegisterController {
  constructor(
    private _registerCreatorUseCase: IRegisterCreatorUseCase,
    private _checkCreatorExistsUseCase: ICheckCreatorExistsUseCase,
    private _verifyCreatorOtpUseCase: IVerifyCreatorOtpUseCase,
    private _resendCreatorOtpUseCase: IResendCreatorOtpUseCase
  ) { }

  async register(req: Request, res: Response) {
    try {
      await this._registerCreatorUseCase.registerCreator(req.body);
      res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.AUTH.OTP_SENT_REGISTRATION
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.CREATOR.REGISTER_FAILED;
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const creator = await this._verifyCreatorOtpUseCase.verifyOtp(email, otp);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.AUTH.CREATOR_REGISTERED,
        creator
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.CREATOR.VERIFY_OTP_FAILED;
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message
      });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const email = req.body.email?.trim().toLowerCase();
      if (!email) return res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.AUTH.EMAIL_REQUIRED_FULL });

      await this._resendCreatorOtpUseCase.resendOtp(email);
      return res.status(StatusCode.OK).json({ success: true, message: MESSAGES.AUTH.OTP_RESENT });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.CREATOR.RESEND_OTP_FAILED;
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message
      });
    }
  }

  async checkExists(req: Request, res: Response) {
    try {
      const { email, phone } = req.body;
      await this._checkCreatorExistsUseCase.checkExists(email, phone);
      return res.status(StatusCode.OK).json({
        success: true,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.CREATOR.CHECK_EXISTS_FAILED;
      if (message === "EMAIL_EXISTS") {
        return res.status(StatusCode.CONFLICT).json({
          success: false,
          message: MESSAGES.CREATOR.EMAIL_EXISTS,
        });
      }
      if (message === "USER_EMAIL_EXISTS") {
        return res.status(StatusCode.CONFLICT).json({
          success: false,
          message: MESSAGES.AUTH.EMAIL_REGISTERED_AS_USER,
        });
      }
      if (message === "PHONE_EXISTS") {
        return res.status(StatusCode.CONFLICT).json({
          success: false,
          message: MESSAGES.CREATOR.PHONE_EXISTS,
        });
      }
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: message === MESSAGES.CREATOR.CHECK_EXISTS_FAILED ? MESSAGES.CREATOR.SOMETHING_WENT_WRONG : message,
      });
    }
  }
}
