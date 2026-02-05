import { UserMapper } from "@/adapters/mapper/user/userMapper";
import { IeditUserProfileUseCase } from "@/domain/interface/user/profile/IeditUserProfileUseCase";
import { IgetUserProfileUseCase } from "@/domain/interface/user/profile/IgetUserProfileUseCase";
import { Request, Response } from "express";

export class UserProfileController {
  constructor(
    private _getUserProfileUsecase: IgetUserProfileUseCase,
    private _editUserProfileUseCase: IeditUserProfileUseCase,
  ) {}
  async getProfile(req: Request, res: Response): Promise<void> {
    console.log("ddd");
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
}
