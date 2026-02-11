import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IApproveCreatorUseCase } from "../../../domain/interface/admin/IApproveCreatorUseCase";
import { IRejectCreatorUseCase } from "../../../domain/interface/admin/IRejectCreatorUseCase";
import { IAdminCreatorListingUseCase } from "../../../domain/interface/admin/IAdminCreatorListingUseCase";
import { IToggleCreatorStatusUseCase } from "@/domain/interface/admin/IToggleCreatorStatusUseCase";

export class AdminCreatorController {
  constructor(
    private _approveCreatorUseCase: IApproveCreatorUseCase,
    private _rejectCreatorUseCase: IRejectCreatorUseCase,
    private _adminCreatorListingUseCase: IAdminCreatorListingUseCase,
    private _toggleCreatorStatusUseCase: IToggleCreatorStatusUseCase,
  ) {}

  async getCreators(req: Request, res: Response) {
    try {
      const page =Number(req.query.page)||1
      const limit=Number(req.query.limit)||10

      const data = await this._adminCreatorListingUseCase.getAllCreators(page,limit);
      return res.status(StatusCode.OK).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
message: error instanceof Error 
  ? error.message 
  : "Internal Server Error",
      });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Creator ID is required",
        });
      }

      await this._approveCreatorUseCase.approveCreator(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Creator approved successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Error approving creator",
      });
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reason = req.body?.reason;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Creator ID is required",
        });
      }

      if (!reason?.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      await this._rejectCreatorUseCase.rejectCreator(id, reason);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Creator rejected successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Error rejecting creator",
      });
    }
  }
  async changeCreatorStatus(req: Request, res: Response) {
    try {
      const { creatorId } = req.params;
      const { status } = req.body;
      await this._toggleCreatorStatusUseCase.execute(creatorId, status);
      return res
        .status(StatusCode.OK)
        .json({ success: true, message: `Creator ${status} successfully` });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
  }
}

