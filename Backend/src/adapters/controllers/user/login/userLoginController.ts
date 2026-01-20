import { IforgotPasswordUseCase } from "../../../../domain/interface/user/auth/IforgotPasswordUseCase";
import { IuserLoginUseCase } from "../../../../domain/interface/user/login/IuserLoginUseCase";
import { Request, Response } from "express";

export class userLoginController {
  constructor(
    private _userLoginUseCase: IuserLoginUseCase,
  ) {}

  async login(req: Request, res: Response) {
    try {
      const result = await this._userLoginUseCase.loginUser(req.body);
      console.log(result)
      const {refreshToken } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (error) {
      console.log("Login error:", error);
      res.status(400).json({
        message: "Error occurs while login",
      });
    }
  }
}
