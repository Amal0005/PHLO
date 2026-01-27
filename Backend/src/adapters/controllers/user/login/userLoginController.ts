import { IuserLoginUseCase } from "../../../../domain/interface/user/login/IuserLoginUseCase";
import { Request, Response } from "express";

export class userLoginController {
  constructor(private _userLoginUseCase: IuserLoginUseCase) {}

  async login(req: Request, res: Response) {
    try {
      const result = await this._userLoginUseCase.loginUser(req.body);
      console.log(result);
      const { refreshToken } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      console.log("Login error:", error);
      res.status(400).json({
        message: error.message || "Error occurs while login",
      });
    }
  }
}
