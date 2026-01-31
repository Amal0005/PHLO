import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IregisterCreatorUseCase } from "@/domain/interface/creator/register/IregisterCreatorUseCase";
import { IcheckCreatorExistsUseCase } from "@/domain/interface/creator/register/IcheckCreatorExistsUseCase";
import { IverifyCreatorOtpUseCase } from "@/domain/interface/creator/register/IverifyCreatorOtpUseCase";
import { IresendCreatorOtpUseCase } from "@/domain/interface/creator/register/IresendCreatorOtpUseCase";

export class CreatorRegisterController {
  constructor(
    private _registerCreatorUseCase: IregisterCreatorUseCase,
    private _checkCreatorExistsUseCase: IcheckCreatorExistsUseCase,
    private _verifyCreatorOtpUseCase: IverifyCreatorOtpUseCase,
    private _resendCreatorOtpUseCase: IresendCreatorOtpUseCase
  ) { }

  async register(req: Request, res: Response) {
    try {
      await this._registerCreatorUseCase.registerCreator(req.body);
      res.status(StatusCode.OK).json({
        success: true,
        message: "OTP sent to email. Please verify to complete registration."
      });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
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
    } catch (error: any) {
      return res.status(StatusCode.OK).json({
        success: false,
        message: error?.message || "OTP Verification Failed"
      });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const email = req.body.email?.trim().toLowerCase();
      if (!email) return res.status(StatusCode.BAD_REQUEST).json({ message: "Email Required" });

      await this._resendCreatorOtpUseCase.resendOtp(email);
      return res.status(StatusCode.OK).json({ success: true, message: "OTP resent successfully" });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error?.message || "Failed to resend OTP"
      });
    }
  }

  async checkExists(req: Request, res: Response) {
    try {
      const { email, phone } = req.body;
      await this._checkCreatorExistsUseCase.checkExists(email, phone);
      return res.status(StatusCode.OK).json({ success: true, message: "Email is available" });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}