import { Request, Response } from "express";
import { IadminLoginUseCase } from "../../../domain/interface/admin/IadminLoginUseCase";
import { ILogoutUseCase } from "../../../domain/interface/IlogoutUseCase";

export class AdminLoginController {
  constructor(
    private _adminLoginUseCase: IadminLoginUseCase,
  ) {}
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
    
 return res.status(200).json({
  success: true,
  message: "Admin login successful",
  data: {
    user: result.user,
    accessToken: result.accessToken,
  },
});

  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}
}
