import { Request, Response } from "express";
import { IGetWalletUseCase } from "@/domain/interface/admin/wallet/IGetWalletUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { logger } from "@/utils/logger";

export class AdminWalletController {
    constructor(private _getWalletUseCase: IGetWalletUseCase) { }

    async getWallet(req: Request, res: Response): Promise<void> {
        try {
            // For general admin wallet, we use ownerId="admin" and ownerType="admin"
            const result = await this._getWalletUseCase.execute("admin", "admin");
            res.status(StatusCode.OK).json(result);
        } catch (error) {
            logger.error("Error fetching admin wallet:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
}
