import { IUserLoginUseCase } from "../../../../domain/interface/user/auth/IUserLoginUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { AppError } from "@/domain/errors/appError";

export class userLoginController {
  constructor(private _userLoginUseCase: IUserLoginUseCase) { }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this._userLoginUseCase.loginUser(req.body);
      const { refreshToken } = result;

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(StatusCode.OK).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: unknown) {
      const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;

      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }
}

