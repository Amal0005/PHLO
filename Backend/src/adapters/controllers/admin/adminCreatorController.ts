import { Request, Response } from "express";
import { IapproveRejectCreatorUseCase } from "../../../domain/interface/admin/IapproveRejectCreatorUseCase";

export class AdminCreatorController {
    constructor(
        private _approveRejectCreatorUseCase: IapproveRejectCreatorUseCase
    ) { }

    async approve(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Creator ID is required",
                });
            }

            await this._approveRejectCreatorUseCase.approveCreator(id);

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

            // Debug logging
            console.log('Request body:', req.body);
            console.log('Request headers:', req.headers);

            // Safe destructuring
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

            await this._approveRejectCreatorUseCase.rejectCreator(id, reason);

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
}