import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import type { IGetCreatorImagesUseCase } from "@/domain/interfaces/creator/IGetCreatorImagesUseCase";
import { MESSAGES } from "@/constants/commonMessages";

export class ViewController {
  constructor(
    private _getCreatorImagesUseCase: IGetCreatorImagesUseCase
  ) {}

  async getImage(req: Request, res: Response) {
    const email = req.query.email as string;
    if (!email) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: MESSAGES.AUTH.EMAIL_REQUIRED });
    }

    const images = await this._getCreatorImagesUseCase.execute(email);
    if (!images) {
      return res.status(StatusCode.NOT_FOUND).json({ message: MESSAGES.CREATOR.NOT_FOUND });
    }

    return res.status(StatusCode.OK).json(images);
  }
}

