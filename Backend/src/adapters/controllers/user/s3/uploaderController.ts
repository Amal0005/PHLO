import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IGetPresignedUrlUseCase } from "@/domain/interface/creator/IGetUrl";
import { IGetPresignedViewUrlUseCase } from "@/domain/interface/creator/IGetPresignedViewUrlUseCase";
export class UploadController {
  constructor(
    private _getPresignedUrlUseCase: IGetPresignedUrlUseCase,
    private _getPresignedViewUrlUseCase: IGetPresignedViewUrlUseCase
  ) {}

  async getPresignedUrl(req: Request, res: Response) {
    const { fileType, folder } = req.body;
    if (!fileType || !folder) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: "Missing" });
    }

    const data = await this._getPresignedUrlUseCase.execute(fileType, folder);
    return res.json(data);
  }

  async getViewUrl(req: Request, res: Response) {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(StatusCode.BAD_REQUEST).json({ message: "Key required" });
    }

    const viewUrl = await this._getPresignedViewUrlUseCase.execute(key);
    return res.json({ viewUrl });
  }
}

