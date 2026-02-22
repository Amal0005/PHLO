import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/IGetSubscriptionUseCase";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { IConfirmSubscriptionUseCase } from "@/domain/interface/creator/payment/IConfirmSubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class CreatorSubscriptionController {
    constructor(
        private _buySubscriptionUseCase: IBuySubscriptionUseCase,
        private _getSubscriptionUseCase: IGetSubscriptionUseCase,
        private _confirmSubscriptionUseCase: IConfirmSubscriptionUseCase
    ) { }

    async getSubscriptions(req: Request, res: Response) {
        try {
            const result = await this._getSubscriptionUseCase.getSubscription('Creator', 1, 10, true);
            return res.status(StatusCode.OK).json(result);
        } catch (error: any) {
            console.error("Error in getSubscriptions:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
        }
    }

    async buySubscription(req: AuthRequest, res: Response) {
        try {
            const { subscriptionId, successUrl, cancelUrl } = req.body;
            const result = await this._buySubscriptionUseCase.buySubscription(req.user!.userId, subscriptionId, successUrl, cancelUrl);
            return res.status(StatusCode.OK).json(result);
        } catch (error: any) {
            console.error("Error in buySubscription:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
        }
    }

    async confirmSubscription(req: AuthRequest, res: Response) {
        try {
            const { sessionId } = req.body;
            if (!sessionId || typeof sessionId !== "string") {
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "sessionId is required" });
            }
            const subscription = await this._confirmSubscriptionUseCase.confirm(sessionId, req.user!.userId);
            if (!subscription) {
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Invalid or already processed session" });
            }
            return res.status(StatusCode.OK).json({ success: true, subscription });
        } catch (error: any) {
            console.error("Error in confirmSubscription:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
        }
    }
}
