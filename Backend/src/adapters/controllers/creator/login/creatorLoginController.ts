import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IcreatorLoginUseCase } from "@/domain/interface/creator/login/IcreatorLoginUseCase";
import { AuthError } from "@/domain/errors/authError";

export class CreatorLoginController {
  constructor(
    private _loginUseCase: IcreatorLoginUseCase
  ) { }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body.Creator as {
        email: string,
        password: string
      }
      console.log(req.body.payload)
      const result = await this._loginUseCase.login(email, password)
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