import { Request, Response } from "express";
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
      res.status(201).json({ success: true, creator });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async checkExists(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this._checkCreatorExistsUseCase.checkExists(email);
      return res.status(200).json({ success: true, message: "Email is available" });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}