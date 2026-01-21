import { Response } from "express";
import { ILogoutUseCase } from "../../domain/interface/IlogoutUseCase";
import { AuthRequest } from "../middlewares/jwtAuthMiddleware";

export class LogoutController {
  constructor(private _logoutUseCase: ILogoutUseCase) {}

  async logout(req: AuthRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      const { exp } = req.user!;

      if (typeof exp !== "number") {
        return res.status(400).json({ message: "Token expiry missing" });
      }

      await this._logoutUseCase.logout(token, exp);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(401).json({ message: "Logout failed" });
    }
  }
}
