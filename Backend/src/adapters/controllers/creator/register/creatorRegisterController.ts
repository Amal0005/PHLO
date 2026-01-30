import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IregisterCreatorUseCase } from "@/domain/interface/creator/register/IregisterCreatorUseCase";
import { IcheckCreatorExistsUseCase } from "@/domain/interface/creator/register/IcheckCreatorExistsUseCase";

export class CreatorRegisterController {
  constructor(
    private _registerCreatorUseCase: IregisterCreatorUseCase,
    private _checkCreatorExistsUseCase: IcheckCreatorExistsUseCase
  ) { }

  async register(req: Request, res: Response) {
    try {
      const creator = await this._registerCreatorUseCase.registerCreator(req.body);
      res.status(StatusCode.CREATED).json({ success: true, creator });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  async checkExists(req: Request, res: Response) {
    try {
      const { email, phone } = req.body;
      await this._checkCreatorExistsUseCase.checkExists(email, phone);
      return res.status(StatusCode.OK).json({ success: true, message: "Email is available" });
    } catch (error: any) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}