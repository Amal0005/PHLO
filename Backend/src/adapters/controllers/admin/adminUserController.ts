import { Request, Response } from "express";
import { IadminUserListingUseCase } from "../../../domain/interface/admin/IadminUserListingUseCase";
import { IadminCreatorListingUseCase } from "../../../domain/interface/admin/IadminCreatorListingUseCase";
import { IToggleUserStatusUseCase } from "../../../domain/interface/admin/IToggleUserStatusUseCase";

export class AdminUserController {
  constructor(
    private _adminUserListingUseCase: IadminUserListingUseCase,
    private _toggleUserStatusUseCase: IToggleUserStatusUseCase
  ) { }
  async getUsers(req: Request, res: Response) {
    try {
      const data = await this._adminUserListingUseCase.getAllUsers()
      const users = data.filter((item) => item.role == "user")

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }
  async changeUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      await this._toggleUserStatusUseCase.execute(userId, status);
      return res.status(200).json({ success: true, message: `User ${status} successfully` });
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  }
}
