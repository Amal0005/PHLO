import { Response } from "express";
import { IGetWalletUseCase } from "@/domain/interface/wallet/IGetWalletUseCase";
import { StatusCode } from "@/constants/statusCodes";
import { logger } from "@/utils/logger";
import { MESSAGES } from "@/constants/commonMessages";
import { AuthRequest } from "../../middlewares/jwtAuthMiddleware";

export class CreatorWalletController {
  constructor(
    private _getWalletUseCase: IGetWalletUseCase,
  ) {}

  async getWallet(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const ownerId = req.user?.userId;
      const ownerType = "creator";

      if (!ownerId) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const { search, source, page, limit } = req.query;

      const result = await this._getWalletUseCase.getWallet(
        ownerId,
        ownerType,
        search as string,
        source as string,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10,
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.WALLET.FETCH_SUCCESS,
        result,
      });
    } catch (error) {
      logger.error("Error fetching creator wallet:", error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.WALLET.FETCH_FAILED,
      });
    }
  }
}
