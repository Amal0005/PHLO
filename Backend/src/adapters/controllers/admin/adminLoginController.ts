import { Request, Response } from "express";
import { IadminLoginUseCase } from "../../../domain/interface/admin/IadminLoginUseCase";

export class AdminLoginController {
  constructor(private adminLoginUseCase: IadminLoginUseCase) {}
async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await this.adminLoginUseCase.login(email, password);
    
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });
    
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: { user: result.user } 
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}
  async logout(req: Request, res: Response) {
    try {
      const adminId = (req as any).user.userId;
      await this.adminLoginUseCase.logout(adminId);
      res.clearCookie("accessToken").clearCookie("refreshToken");
      return res.status(200).json({
        success: true,
        message: "Admin logged out successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Logout failed",
      });
    }
  }
}
