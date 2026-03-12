import { Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/constants/commonMessages";
import { UserMapper } from "@/application/mapper/user/userMapper";
import { IGetUserProfileUseCase } from "@/domain/interface/user/profile/IGetUserProfileUseCase";
import { IEditUserProfileUseCase } from "@/domain/interface/user/profile/IEditUserProfileUseCase";
import { IChangePasswordUseCase } from "@/domain/interface/user/profile/IChangepasswordUseCase";
import { IOTPService } from "@/domain/interface/service/IOtpServices";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";

export class UserProfileController {
    constructor(
        private _getUserProfileUseCase: IGetUserProfileUseCase,
        private _editUserProfileUseCase: IEditUserProfileUseCase,
        private _changePasswordUseCase: IChangePasswordUseCase,
        private _otpService: IOTPService,
        private _userRepo: IUserRepository,
        private _creatorRepo: ICreatorRepository,
    ) { }


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
            const result = await this._otpService.verifyOtp(email, otp);
            if (result === "EXPIRED") {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: MESSAGES.AUTH.OTP_EXPIRED });
                return;
            }
            if (result === "INVALID") {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: MESSAGES.AUTH.INVALID_OTP });
                return;
            }
            res.status(StatusCode.OK).json({ success: true, message: MESSAGES.AUTH.OTP_VERIFIED_SUCCESS });
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
            const existingUser = await this._userRepo.findByEmail(email);
            if (existingUser && existingUser._id !== userId) {
                res.status(StatusCode.CONFLICT).json({ success: false, message: MESSAGES.AUTH.EMAIL_ALREADY_IN_USE });
                return;
            }
            const existingCreator = await this._creatorRepo.findByEmail(email);
            if (existingCreator) {
                res.status(StatusCode.CONFLICT).json({ success: false, message: MESSAGES.AUTH.EMAIL_REGISTERED_AS_CREATOR });
                return;
            }
            res.status(StatusCode.OK).json({ success: true, message: MESSAGES.AUTH.EMAIL_AVAILABLE });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.CHECK_EMAIL_FAILED;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }
}
