import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IGetPresignedViewUrlUseCase } from "@/domain/interface/creator/IgetPresignedViewUrlUseCase";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";

export class ViewController {
  constructor(
    private _creatorRepo: CreatorRepository,
    private _getPresignedViewUrlUseCase: IGetPresignedViewUrlUseCase
  ) {}

  async getImage(req: Request, res: Response) {
    const email = req.query.email as string;
    if (!email) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: "Email required" });
    }

    const creator = await this._creatorRepo.findByEmail(email);
    if (!creator) {
      return res.status(StatusCode.NOT_FOUND).json({ message: "Creator not found" });
    }

    return res.json({
      profilePhoto: creator.profilePhoto
        ? await this._getPresignedViewUrlUseCase.execute(creator.profilePhoto)
        : null,
      governmentId: creator.governmentId
        ? await this._getPresignedViewUrlUseCase.execute(creator.governmentId)
        : null,
    });
  }
}
