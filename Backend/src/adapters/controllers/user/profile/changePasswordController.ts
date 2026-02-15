import { IChangePasswordUseCase } from "@/domain/interface/user/profile/IChangepasswordUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class ChangePasswordController {
    constructor(private _changePasswordUseCase: IChangePasswordUseCase) { }

    async execute(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
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
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: error.message || MESSAGES.AUTH.PASSWORD_UPDATE_FAILED,
            });
        }
    }
}
