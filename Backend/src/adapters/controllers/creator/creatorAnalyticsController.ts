import type { Response } from "express";
import type { IGetCreatorAnalyticsUseCase } from "@/domain/interfaces/creator/analytics/IGetCreatorAnalyticsUseCase";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class CreatorAnalyticsController {
    constructor(
        private _getCreatorAnalyticsUseCase: IGetCreatorAnalyticsUseCase
    ) {}

    async getAnalytics(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            const analytics = await this._getCreatorAnalyticsUseCase.getAnalytics(creatorId);

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Analytics fetched successfully",
                data: analytics
            });
        } catch (error) {
            console.error("Error fetching creator analytics:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER_ERROR_LOWER
            });
        }
    }
}
