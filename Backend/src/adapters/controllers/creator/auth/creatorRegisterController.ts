import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
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
        message: "OTP sent to email. Please verify to complete registration."
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to register creator";
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const creator = await this._verifyCreatorOtpUseCase.verifyOtp(email, otp);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Creator registered successfully! Awaiting admin approval.",
        creator
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to verify OTP";
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message
      });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const email = req.body.email?.trim().toLowerCase();
      if (!email) return res.status(StatusCode.BAD_REQUEST).json({ message: "Email Required" });

      await this._resendCreatorOtpUseCase.resendOtp(email);
      return res.status(StatusCode.OK).json({ success: true, message: "OTP resent successfully" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to resend OTP";
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
      const message = error instanceof Error ? error.message : "Failed to check creator exists";
      if (message === "EMAIL_EXISTS") {
        return res.status(StatusCode.CONFLICT).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (message === "USER_EMAIL_EXISTS") {
        return res.status(StatusCode.CONFLICT).json({
          success: false,
          message: "This email is already registered as a user",
        });
      }
      if (message === "PHONE_EXISTS") {
        return res.status(StatusCode.CONFLICT).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: message === "Failed to check creator exists" ? "Something went wrong" : message,
      });
    }
  }
}
