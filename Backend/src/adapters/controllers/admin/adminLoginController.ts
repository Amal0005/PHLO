import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IAdminLoginUseCase } from "../../../domain/interface/admin/IAdminLoginUseCase";
import { AppError } from "@/domain/errors/appError";

interface LoginRequestBody {
  email: string;
  password: string;
}

export class AdminLoginController {
  constructor(
    private _adminLoginUseCase: IAdminLoginUseCase,
  ) { }
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as LoginRequestBody;
      const result = await this._adminLoginUseCase.login(email, password);

      res.cookie("adminRefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ADMIN.LOGIN_SUCCESS,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });

    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : StatusCode.UNAUTHORIZED;
      return res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  }
}

