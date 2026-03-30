import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import { AppError } from "@/domain/errors/appError";
import type { IAdminLoginUseCase } from "@/domain/interface/admin/IAdminLoginUseCase";

interface LoginRequestBody {
  email: string;
  password: string;
}

export class AdminLoginController {
  constructor(
    private _adminLoginUseCase: IAdminLoginUseCase,
  ) {}
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as LoginRequestBody;
      const result = await this._adminLoginUseCase.login(email, password);

      res.cookie("adminRefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ADMIN.LOGIN_SUCCESS,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });

    } catch (error: unknown) {
      const statusCode = error instanceof AppError ? error.statusCode : StatusCode.UNAUTHORIZED;
      return res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.AUTH.AUTHENTICATION_FAILED,
      });
    }
  }
}

