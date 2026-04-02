import type { Request, Response } from "express";
import type { IGetWalletUseCase } from "@/domain/interfaces/wallet/IGetWalletUseCase";
import type { ICreditWalletUseCase } from "@/domain/interfaces/wallet/ICreditWalletUseCase";
import { StatusCode } from "@/constants/statusCodes";
import { logger } from "@/utils/logger";
import { MESSAGES } from "@/constants/commonMessages";import type { WalletOwnerType } from "@/domain/entities/walletEntity";

export class AdminWalletController {
  constructor(
    private _getWalletUseCase: IGetWalletUseCase,
    private _creditWalletUseCase: ICreditWalletUseCase,
  ) {}

  async getWallet(req: Request, res: Response): Promise<Response> {
    try {
      const { ownerId, ownerType, search, source, page, limit } = req.query;

      const id = (ownerId as string) || "admin";
      const typeParam = ((ownerType as string) as WalletOwnerType) || "admin";

      const result = await this._getWalletUseCase.getWallet(
        id,
        typeParam,
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
      logger.error("Error fetching wallet:", error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.WALLET.FETCH_FAILED,
      });
    }
  }

  async creditWallet(req: Request, res: Response): Promise<Response> {
    try {
      const {
        ownerId,
        ownerType,
        amount,
        description,
        source,
        sourceId,
        relatedName,
      } = req.body;

      await this._creditWalletUseCase.creditWallet(ownerId, ownerType, amount, {
        amount,
        type: "credit",
        description,
        source,
        sourceId,
        relatedName,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.WALLET.CREDIT_SUCCESS,
      });
    } catch (error) {
      logger.error("Error crediting wallet:", error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.WALLET.CREDIT_FAILED,
      });
    }
  }
}
