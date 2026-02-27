import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IApproveCreatorUseCase } from "@/domain/interface/admin/IApproveCreatorUseCase";
import { IRejectCreatorUseCase } from "@/domain/interface/admin/IRejectCreatorUseCase";
import { IAdminCreatorListingUseCase } from "@/domain/interface/admin/IAdminCreatorListingUseCase";
import { IToggleCreatorStatusUseCase } from "@/domain/interface/admin/IToggleCreatorStatusUseCase";
import { AppError } from "@/domain/errors/appError";

interface RejectRequestBody {
  reason: string;
}

interface ChangeStatusRequestBody {
  status: "approved" | "blocked";
}

export class AdminCreatorController {
  constructor(
    private _approveCreatorUseCase: IApproveCreatorUseCase,
    private _rejectCreatorUseCase: IRejectCreatorUseCase,
    private _adminCreatorListingUseCase: IAdminCreatorListingUseCase,
    private _toggleCreatorStatusUseCase: IToggleCreatorStatusUseCase,
  ) {}

  async getCreators(req: Request, res: Response): Promise<Response> {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10

      const data = await this._adminCreatorListingUseCase.getAllCreators(page, limit);
      return res.status(StatusCode.OK).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error
          ? error.message
          : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async approve(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ADMIN.CREATOR_ID_REQUIRED,
        });
      }

      await this._approveCreatorUseCase.approveCreator(id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ADMIN.CREATOR_APPROVED,
      });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.ADMIN.CREATOR_APPROVE_ERROR,
      });
    }
  }

  async reject(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { reason } = req.body as RejectRequestBody;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ADMIN.CREATOR_ID_REQUIRED,
        });
      }

      if (!reason?.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ADMIN.REJECTION_REASON_REQUIRED,
        });
      }

      await this._rejectCreatorUseCase.rejectCreator(id, reason);

      return res.status(StatusCode.OK).json({
        success: true,
        message: MESSAGES.ADMIN.CREATOR_REJECTED,
      });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.ADMIN.CREATOR_REJECT_ERROR,
      });
    }
  }
  async changeCreatorStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { creatorId } = req.params;
      const { status } = req.body as ChangeStatusRequestBody;
      await this._toggleCreatorStatusUseCase.toggleStatus(creatorId, status);
      return res
        .status(StatusCode.OK)
        .json({ success: true, message: `Creator ${status} successfully` });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR
      });
    }
  }
}

