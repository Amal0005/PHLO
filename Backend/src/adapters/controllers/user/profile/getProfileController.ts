import { UserMapper } from "@/adapters/mapper/user/userMapper";
import { IGetUserProfileUseCase } from "@/domain/interface/user/profile/IGetUserProfileUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class GetProfileController {
    constructor(private _getUserProfileUsecase: IGetUserProfileUseCase) { }

    async execute(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            const user = await this._getUserProfileUsecase.getProfile(userId);
            if (!user) {
                res.status(StatusCode.NOT_FOUND).json({ success: false, message: MESSAGES.AUTH.USER_NOT_FOUND });
                return;
            }
            const userDto = UserMapper.toDto(user);
            res.status(StatusCode.OK).json({ success: true, user: userDto });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }
}
