import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { ILogoutUseCase } from "../../domain/interface/IlogoutUseCase";
import { AuthRequest } from "../middlewares/jwtAuthMiddleware";

export class LogoutController {
  constructor(private _logoutUseCase: ILogoutUseCase) { }

  async logout(req: AuthRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(StatusCode.UNAUTHORIZED).json({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      const { exp } = req.user!;

      if (typeof exp !== "number") {
        return res.status(StatusCode.BAD_REQUEST).json({ message: "Token expiry missing" });
      }

      await this._logoutUseCase.logout(token, exp);

      let cookieName = "userRefreshToken";
      if (req.user?.role === "admin") cookieName = "adminRefreshToken";
      else if (req.user?.role === "creator") cookieName = "creatorRefreshToken";

      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Logout failed" });
    }
  }
}
