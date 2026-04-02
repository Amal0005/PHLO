import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import type { IToggleUserStatusUseCase } from "@/domain/interfaces/admin/IToggleUserStatusUseCase";
import type { IAdminUserListingUseCase } from "@/domain/interfaces/admin/IAdminUserListingUseCase";

export class AdminUserController {
  constructor(
    private _adminUserListingUseCase: IAdminUserListingUseCase,
    private _toggleUserStatusUseCase: IToggleUserStatusUseCase
  ) {}
  async getUsers(req: Request, res: Response) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Number(req.query.limit) || 10);
      const search = req.query.search as string;
      const status = req.query.status as string;

      const data =
        await this._adminUserListingUseCase.getAllUsers(page, limit, search, status);

      return res.status(StatusCode.OK).json({
        success: true,
        ...data,
      });
    } catch (error: unknown) {
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
      await this._toggleUserStatusUseCase.toggleStatus(userId, status);
      return res.status(StatusCode.OK).json({ success: true, message: MESSAGES.USER.STATUS_CHANGED(status) });
    } catch (error: unknown) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
  }
}

