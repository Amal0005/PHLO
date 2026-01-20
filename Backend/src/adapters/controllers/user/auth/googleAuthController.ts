import { Request, Response } from "express";
import { IgoogleLoginUseCase } from "../../../../domain/interface/user/auth/IgoogleLoginUseCase";

export class GoogleAuthController {
  constructor(private _googleLoginUseCase: IgoogleLoginUseCase) {}

  async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ message: "ID token is required" });
      }
      
      const { user, accessToken, refreshToken } =
        await this._googleLoginUseCase.execute(idToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        user,
        accessToken,
      });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Google login failed",
      });
    }
  }
}
