import { IChangePasswordUseCase } from "@/domain/interface/user/profile/IChangepasswordUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class ChangePasswordController {
    constructor(private _changePasswordUseCase: IChangePasswordUseCase) {}

    async execute(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
                return;
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.ALL_FIELDS_REQUIRED,
                });
                return;
            }
            await this._changePasswordUseCase.changePassword(userId, currentPassword, newPassword);
            res.status(StatusCode.OK).json({
                success: true,
                message: MESSAGES.AUTH.PASSWORD_UPDATE_SUCCESS,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.PASSWORD_UPDATE_FAILED;
            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message,
            });
        }
    }
}
