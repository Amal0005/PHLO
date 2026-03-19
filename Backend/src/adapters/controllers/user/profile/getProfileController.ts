import { UserMapper } from "@/application/mapper/user/userMapper";
import { IGetUserProfileUseCase } from "@/domain/interface/user/profile/IGetUserProfileUseCase";
import { Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class GetProfileController {
    constructor(private _getUserProfileUsecase: IGetUserProfileUseCase) {}

    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
                return;
            }
            const user = await this._getUserProfileUsecase.getProfile(userId);
            if (!user) {
                res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.AUTH.USER_NOT_FOUND });
                return;
            }
            const userDto = UserMapper.toDto(user);
            res.status(StatusCode.OK).json({ success: true, user: userDto });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message,
            });
        }
    }
}
