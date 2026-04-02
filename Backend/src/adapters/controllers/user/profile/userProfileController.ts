import type { Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/constants/commonMessages";
import { UserMapper } from "@/application/mapper/user/userMapper";
import type { IGetUserProfileUseCase } from "@/domain/interfaces/user/profile/IGetUserProfileUseCase";
import type { IEditUserProfileUseCase } from "@/domain/interfaces/user/profile/IEditUserProfileUseCase";
import type { IChangePasswordUseCase } from "@/domain/interfaces/user/profile/IChangepasswordUseCase";
import type { ICheckEmailUseCase } from "@/domain/interfaces/user/profile/ICheckEmailUseCase";
import type { IVerifyEmailChangeOtpUseCase } from "@/domain/interfaces/user/profile/IVerifyEmailChangeOtpUseCase";

export class UserProfileController {
    constructor(
        private _getUserProfileUseCase: IGetUserProfileUseCase,
        private _editUserProfileUseCase: IEditUserProfileUseCase,
        private _changePasswordUseCase: IChangePasswordUseCase,
        private _checkEmailUseCase: ICheckEmailUseCase,
        private _verifyEmailChangeOtpUseCase: IVerifyEmailChangeOtpUseCase
    ) {}


    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
                return;
            }
            const user = await this._getUserProfileUseCase.getProfile(userId);
            if (!user) {
                res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.AUTH.USER_NOT_FOUND });
                return;
            }
            const userDto = UserMapper.toDto(user);
            res.status(StatusCode.OK).json({ success: true, user: userDto });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }


    async editProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
                return;
            }
            const user = await this._editUserProfileUseCase.editProfile(userId, req.body);
            res.status(StatusCode.OK).json({ success: true, user });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }


    async changePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
                return;
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: MESSAGES.ERROR.ALL_FIELDS_REQUIRED });
                return;
            }
            await this._changePasswordUseCase.changePassword(userId, currentPassword, newPassword);
            res.status(StatusCode.OK).json({ success: true, message: MESSAGES.AUTH.PASSWORD_UPDATE_SUCCESS });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.PASSWORD_UPDATE_FAILED;
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }



    async verifyEmailChangeOtp(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
                return;
            }
            const email = req.body.email?.trim().toLowerCase();
            const otp = String(req.body.otp);
            if (!email || !otp) {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: MESSAGES.AUTH.EMAIL_OTP_REQUIRED });
                return;
            }
            const result = await this._verifyEmailChangeOtpUseCase.verifyEmailChangeOtp(email, otp);
            res.status(StatusCode.OK).json({ success: true, message: result.message });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }



    async checkEmail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
                return;
            }
            const email = req.body.email?.trim().toLowerCase();
            if (!email) {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: MESSAGES.AUTH.EMAIL_IS_REQUIRED });
                return;
            }
            const result = await this._checkEmailUseCase.checkEmail(userId, email);
            res.status(StatusCode.OK).json({ success: true, message: result.message });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.CHECK_EMAIL_FAILED;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }
}
