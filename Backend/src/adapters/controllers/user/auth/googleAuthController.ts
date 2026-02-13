import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IGoogleLoginUseCase } from "@/domain/interface/user/auth/IGoogleLoginUseCase";

export class GoogleAuthController {
  constructor(private _googleLoginUseCase: IGoogleLoginUseCase) { }

  async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.AUTH.TOKEN_REQUIRED });
      }

      const { user, accessToken, refreshToken } =
        await this._googleLoginUseCase.execute(idToken);

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCode.OK).json({
        user,
        accessToken,
      });
    } catch (error: any) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: error.message || MESSAGES.AUTH.GOOGLE_LOGIN_FAILED,
      });
    }
  }
}

