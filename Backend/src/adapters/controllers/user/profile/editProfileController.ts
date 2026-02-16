import { IEditUserProfileUseCase } from "@/domain/interface/user/profile/IEditUserProfileUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/utils/commonMessages";

export class EditProfileController {
    constructor(private _editUserProfileUseCase: IEditUserProfileUseCase) { }

    async execute(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
                return;
            }

            const user = await this._editUserProfileUseCase.editProfile(
                userId,
                req.body,
            );
            res.status(StatusCode.OK).json({
                success: true,
                user,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message,
            });
        }
    }
}
