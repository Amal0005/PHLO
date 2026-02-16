import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IeditCreatorProfileUseCase } from "@/domain/interface/creator/profile/IEditCreatorUseCase";
import { IGetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IGetCreatorProfileUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class CreatorProfileController {
    constructor(
        private _getCreatorProfileUseCase: IGetCreatorProfileUseCase,
        private _editCreatorProfileUseCase: IeditCreatorProfileUseCase
    ) {}
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const creator = await this._getCreatorProfileUseCase.getProfile(req.user!.userId)
            res.status(StatusCode.OK).json({ success: true, creator });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to get creator profile";
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }
    async editProfile(req: AuthRequest, res: Response) {
        try {
            const creator = await this._editCreatorProfileUseCase.editProfile(req.user!.userId, req.body);
            res.status(StatusCode.OK).json({ success: true, creator });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to edit creator profile";
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }
}
