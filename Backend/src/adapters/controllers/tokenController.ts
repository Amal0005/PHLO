import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import type { IRefreshTokenUseCase } from "@/domain/interfaces/user/auth/IRefreshTokenUseCase";

export class TokenController {
  constructor(private _refreshTokenUseCase: IRefreshTokenUseCase) {}

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING,
        });
      }
      
      const result = await this._refreshTokenUseCase.refreshToken(refreshToken);

      return res.status(StatusCode.OK).json({
        success: true,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : MESSAGES.AUTH.INVALID_REFRESH_TOKEN;
      console.error("Refresh token error:", error);
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message,
      });
    }
  }
}
