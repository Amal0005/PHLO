import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IAdminUserListingUseCase } from "../../../domain/interface/admin/IAdminUserListingUseCase";
import { IAdminCreatorListingUseCase } from "../../../domain/interface/admin/IAdminCreatorListingUseCase";
import { IToggleUserStatusUseCase } from "../../../domain/interface/admin/IToggleUserStatusUseCase";

export class AdminUserController {
  constructor(
    private _adminUserListingUseCase: IAdminUserListingUseCase,
    private _toggleUserStatusUseCase: IToggleUserStatusUseCase
  ) { }
  async getUsers(req: Request, res: Response) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Number(req.query.limit) || 10);

      const data =
        await this._adminUserListingUseCase.getAllUsers(page, limit);

      return res.status(StatusCode.OK).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async changeUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      await this._toggleUserStatusUseCase.execute(userId, status);
      return res.status(StatusCode.OK).json({ success: true, message: `User ${status} successfully` });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
  }
}

