import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IadminLoginUseCase } from "../../../domain/interface/admin/IadminLoginUseCase";
import { ILogoutUseCase } from "../../../domain/interface/IlogoutUseCase";

export class AdminLoginController {
  constructor(
    private _adminLoginUseCase: IadminLoginUseCase,
  ) { }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this._adminLoginUseCase.login(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Admin login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });

    } catch (error: any) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }
}
