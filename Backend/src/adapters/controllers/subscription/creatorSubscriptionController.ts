import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/subscription/IGetSubscriptionUseCase";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class CreatorSubscriptionController {
    constructor(
        private _buySubscriptionUseCase: IBuySubscriptionUseCase,
        private _getSubscriptionUseCase: IGetSubscriptionUseCase
    ) {}

    async getSubscriptions(req: Request, res: Response) {
        try {
            const result = await this._getSubscriptionUseCase.getSubscription(1, 10, true);
            return res.status(StatusCode.OK).json(result);
        } catch (error: unknown) {
            const err = error instanceof Error ? error.message : "Internal Server Error";
            console.error("Error in getSubscriptions:", err);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: err });
        }
    }

    async buySubscription(req: AuthRequest, res: Response) {
        try {
            const { subscriptionId, successUrl, cancelUrl } = req.body;
            console.log("Bodyyyyyyyyy", subscriptionId)
            const result = await this._buySubscriptionUseCase.buySubscription(req.user!.userId, subscriptionId, successUrl, cancelUrl);
            return res.status(StatusCode.OK).json(result);
        } catch (error: unknown) {
            const err = error instanceof Error ? error.message : "Internal Server Error";
            console.error("Error in buySubscription:", err);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: err });
        }
    }
}
