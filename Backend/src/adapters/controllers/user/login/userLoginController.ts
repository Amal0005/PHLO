import { IforgotPasswordUseCase } from "../../../../domain/interface/user/auth/IforgotPasswordUseCase";
import { IuserLoginUseCase } from "../../../../domain/interface/user/login/IuserLoginUseCase";
import { Request, Response } from "express";

export class userLoginController {
  constructor(
    private _userLoginUseCase: IuserLoginUseCase,
    private _forgotPasswordUseCase:IforgotPasswordUseCase
  ) {}

  async login(req: Request, res: Response) {
    try {
      const result = await this._userLoginUseCase.loginUser(req.body);
      const { user, accessToken, refreshToken } = result;

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
      }
      res.cookie("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          user: result.user
        });
    } catch (error) {
      console.log("Login error:", error);
      res.status(400).json({
        message: "Error occurs while login",
      });
    }
  }

  async forgotPassword(req: Request, res: Response){
    try {
      const email=req.body.email?.trim().toLowerCase()
       if (!email) {
      return res.status(400).json({ message: "Email required" });

    }
    await this._forgotPasswordUseCase.sendOtp(email)
        return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
    } catch (error) {
         return res.status(400).json({
      success: false,
      message:  "Failed to send OTP",
    });
    }
  }
}
