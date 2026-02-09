import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IeditCreatorProfileUseCase } from "@/domain/interface/creator/profile/IeditCreatorUseCase";
import { IgetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IgetCreatorProfileUseCase";
import { Request, Response } from "express";

export class CreatorProfileController {
    constructor(
        private _getCreatorProfileUseCase: IgetCreatorProfileUseCase,
        private _editCreatorProfileUseCase: IeditCreatorProfileUseCase
    ) { }
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const creator = await this._getCreatorProfileUseCase.getProfile(req.user!.userId)
            res.status(200).json({ success: true, creator });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async editProfile(req: AuthRequest, res: Response) {
        try {
            const creator = await this._editCreatorProfileUseCase.editProfile(req.user!.userId, req.body);
            res.status(200).json({ success: true, creator });
        } catch (error: any) {
            console.log(error.message)
            res.status(400).json({ success: false, message: error.message });
        }
    }
}