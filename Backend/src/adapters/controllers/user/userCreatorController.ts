import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import type { IAdminCreatorListingUseCase } from "@/domain/interfaces/admin/IAdminCreatorListingUseCase";
import type { IGetCreatorProfileUseCase } from "@/domain/interfaces/creator/profile/IGetCreatorProfileUseCase";

export class UserCreatorController {
  constructor(
    private _creatorListingUseCase: IAdminCreatorListingUseCase,
    private _getCreatorProfileUseCase: IGetCreatorProfileUseCase
  ) {}

  async listCreators(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
      const search = req.query.search as string;

      // Users should only see approved creators
      const data = await this._creatorListingUseCase.getAllCreators(
        page,
        limit,
        search,
        "approved"
      );
      
      return res.status(StatusCode.OK).json({
        success: true,
        ...data,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message
      });
    }
  }

  async getCreatorById(req: Request, res: Response) {
    try {
      const creatorId = req.params.id;
      const creator = await this._getCreatorProfileUseCase.getProfile(creatorId);

      if (!creator || creator.status !== "approved") {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.CREATOR.NOT_FOUND
        });
      }

      return res.status(StatusCode.OK).json({
        success: true,
        creator
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message
      });
    }
  }
}
