import { IGetSubscriptionUseCase } from "@/domain/interface/admin/IGetSubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class GetSubscriptionController {
    constructor(
        private _getSubscriptionUseCase: IGetSubscriptionUseCase
    ) {}

    async getSubscriptions(req: Request, res: Response) {
        try {
            const { type, page, limit } = req.query;
            const result = await this._getSubscriptionUseCase.getSubscription(
                type as 'User' | 'Creator',
                Number(page) || 1,
                Number(limit) || 10
            );
            return res.status(StatusCode.OK).json({ success: true, message: "Subscriptions listed", result });
        } catch (error) {
            console.error("GetSubscriptions Error:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch subscriptions" });
        }
    }
}
