import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthError } from "@/domain/errors/authError";
import { ICreatorLoginUseCase } from "@/domain/interface/creator/auth/ICreatorLoginUseCase";

export class CreatorLoginController {
  constructor(
    private _loginUseCase: ICreatorLoginUseCase
  ) { }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body.Creator as {
        email: string,
        password: string
      }
      const result = await this._loginUseCase.login(email, password)

      if (result.status === "approved" && result.refreshToken) {
        res.cookie("creatorRefreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000
        });
        delete result.refreshToken;
      }

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {

      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          ...error.payload,
        });
      }

      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
