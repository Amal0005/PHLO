import { Request, Response } from "express";
import { IapproveCreatorUseCase } from "../../../domain/interface/admin/IapproveCreatorUseCase";
import { IrejectCreatorUseCase } from "../../../domain/interface/admin/IrejectCreatorUseCase";
import { IadminCreatorListingUseCase } from "../../../domain/interface/admin/IadminCreatorListingUseCase";
import { ItoggleCreatorStatusUseCase } from "@/domain/interface/admin/ItoggleCreatorStatusUseCase";

export class AdminCreatorController {
  constructor(
    private _approveCreatorUseCase: IapproveCreatorUseCase,
    private _rejectCreatorUseCase: IrejectCreatorUseCase,
    private _adminCreatorListingUseCase: IadminCreatorListingUseCase,
    private _toggleCreatorStatusUseCase: ItoggleCreatorStatusUseCase,
  ) {}

  async getCreators(req: Request, res: Response) {
    try {
      const data = await this._adminCreatorListingUseCase.getAllCreators();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Creator ID is required",
        });
      }

      await this._approveCreatorUseCase.approveCreator(id);

      return res.status(200).json({
        success: true,
        message: "Creator approved successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
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
        return res.status(400).json({
          success: false,
          message: "Creator ID is required",
        });
      }

      if (!reason?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      await this._rejectCreatorUseCase.rejectCreator(id, reason);

      return res.status(200).json({
        success: true,
        message: "Creator rejected successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
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
        .status(200)
        .json({ success: true, message: `Creator ${status} successfully` });
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  }
}
