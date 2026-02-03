import { IuserLoginUseCase } from "../../../../domain/interface/user/login/IuserLoginUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class userLoginController {
  constructor(private _userLoginUseCase: IuserLoginUseCase) { }

  async login(req: Request, res: Response) {
    try {
      const result = await this._userLoginUseCase.loginUser(req.body);
      console.log(result);
      const { refreshToken } = result;

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      return res.status(StatusCode.OK).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      console.log("Login error:", error);
      res.status(StatusCode.BAD_REQUEST).json({
        message: error.message || "Error occurs while login",
      });
    }
  }
}
