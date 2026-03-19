import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IeditCreatorProfileUseCase } from "@/domain/interface/creator/profile/IEditCreatorUseCase";
import { IGetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IGetCreatorProfileUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { Response } from "express";
import { StatusCode } from "@/constants/statusCodes";

export class CreatorProfileController {
    constructor(
        private _getCreatorProfileUseCase: IGetCreatorProfileUseCase,
        private _editCreatorProfileUseCase: IeditCreatorProfileUseCase
    ) {}
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const creator = await this._getCreatorProfileUseCase.getProfile(req.user!.userId)
            if (!creator) {
                return res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.CREATOR.NOT_FOUND });
            }
            const subscription = creator.subscription;
            const isSubscribed = !!(subscription && subscription.status === "active" && new Date(subscription.endDate) > new Date());
            const creatorWithSubStatus = { ...creator, isSubscribed };
            res.status(StatusCode.OK).json({ success: true, creator: creatorWithSubStatus });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.CREATOR.PROFILE_GET_FAILED;
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }
    async editProfile(req: AuthRequest, res: Response) {
        try {
            const creator = await this._editCreatorProfileUseCase.editProfile(req.user!.userId, req.body);
            res.status(StatusCode.OK).json({ success: true, creator });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.CREATOR.PROFILE_EDIT_FAILED;
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }
}
