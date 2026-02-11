import { UserMapper } from "@/adapters/mapper/user/userMapper";
import { IChangepasswordUseCase } from "@/domain/interface/user/profile/IChangepasswordUseCase";
import { IEditUserProfileUseCase } from "@/domain/interface/user/profile/IEditUserProfileUseCase";
import { IGetUserProfileUseCase } from "@/domain/interface/user/profile/IGetUserProfileUseCase";
import { Request, Response } from "express";

export class UserProfileController {
  constructor(
    private _getUserProfileUsecase: IGetUserProfileUseCase,
    private _editUserProfileUseCase: IEditUserProfileUseCase,
    private _changePasswordUseCase: IChangepasswordUseCase
  ) { }
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const user = await this._getUserProfileUsecase.getProfile(userId);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      const userDto = UserMapper.toDto(user);
      res.status(200).json({ success: true, user: userDto });
    } catch (error: any) {
      res.status(500).json({
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
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      res.status(500).json({
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
        res.status(400).json({
          success: false,
          message: "Both fields are required",
        });
        return;
      }
      await this._changePasswordUseCase.changePassword(userId, currentPassword, newPassword)
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update password",
      });
    }
  }
}

