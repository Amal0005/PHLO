import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/subscription/IGetSubscriptionUseCase";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class CreatorSubscriptionController {
    constructor(
        private _buySubscriptionUseCase: IBuySubscriptionUseCase,
        private _getSubscriptionUseCase: IGetSubscriptionUseCase
    ) { }

    async getSubscriptions(req: Request, res: Response) {
        try {
            const result = await this._getSubscriptionUseCase.getSubscription(1, 10, true);
            return res.status(StatusCode.OK).json(result);
        } catch (error: any) {
            console.error("Error in getSubscriptions:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
        }
    }

    async buySubscription(req: AuthRequest, res: Response) {
        try {
            const { subscriptionId } = req.body;
            if (!subscriptionId) {
                return res.status(StatusCode.BAD_REQUEST).json({ message: "Subscription ID is required" });
            }
            const result = await this._buySubscriptionUseCase.buySubscription(req.user!.userId, subscriptionId);
            return res.status(StatusCode.OK).json(result);
        } catch (error: any) {
            console.error("Error in buySubscription:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
        }
    }
}
