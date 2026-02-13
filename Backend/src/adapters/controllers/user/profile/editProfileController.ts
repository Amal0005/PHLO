import { IEditUserProfileUseCase } from "@/domain/interface/user/profile/IEditUserProfileUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class EditProfileController {
    constructor(private _editUserProfileUseCase: IEditUserProfileUseCase) { }

    async execute(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;

            const user = await this._editUserProfileUseCase.editProfile(
                userId,
                req.body,
            );
            res.status(StatusCode.OK).json({
                success: true,
                user,
            });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }
}
