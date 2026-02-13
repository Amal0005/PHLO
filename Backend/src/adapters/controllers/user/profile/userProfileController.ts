import { UserMapper } from "@/adapters/mapper/user/userMapper";
import { IEditUserProfileUseCase } from "@/domain/interface/user/profile/IEditUserProfileUseCase";
import { IGetUserProfileUseCase } from "@/domain/interface/user/profile/IGetUserProfileUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IChangePasswordUseCase } from "@/domain/interface/user/profile/IChangePasswordUseCase";

export class UserProfileController {
  constructor(
    private _getUserProfileUsecase: IGetUserProfileUseCase,
    private _editUserProfileUseCase: IEditUserProfileUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase
  ) { }
  async getProfile(req: Request, res: Response): Promise<void> {
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
  async editProfile(req: Request, res: Response): Promise<void> {
    console.log(typeof req.body.name);

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
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { currentPassword, newPassword } = req.body
      if (!currentPassword || !newPassword) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ERROR.ALL_FIELDS_REQUIRED,
        });
        return;
      }
      await this._changePasswordUseCase.changePassword(userId, currentPassword, newPassword)
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

