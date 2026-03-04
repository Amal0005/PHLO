import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { ILogoutUseCase } from "../../domain/interface/ILogoutUseCase";
import { AuthRequest } from "../middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/utils/commonMessages";

export class LogoutController {
  constructor(private _logoutUseCase: ILogoutUseCase) { }

  async logout(req: AuthRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.AUTH.AUTHORIZATION_HEADER_MISSING });
      }

      const token = authHeader.split(" ")[1];
      const { exp } = req.user!;

      if (typeof exp !== "number") {
        return res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.AUTH.TOKEN_EXPIRY_MISSING });
      }

      await this._logoutUseCase.logout(token, exp);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.AUTH.LOGOUT_FAILED;
      return res.status(StatusCode.UNAUTHORIZED).json({ message });
    }
  }
}

