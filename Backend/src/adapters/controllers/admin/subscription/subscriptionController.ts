import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AppError } from "@/domain/errors/appError";
import { IAddSubscriptionUseCase } from "@/domain/interface/admin/IAddSubscriptionUseCase";
import { IEditSubscriptionUseCase } from "@/domain/interface/admin/IEditSubscriptionUseCase";
import { IDeleteSubscriptionUseCase } from "@/domain/interface/admin/IDeleteSubscriptionUseCase";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/IGetSubscriptionUseCase";

export class SubscriptionController {
    constructor(
        private _addSubscriptionUseCase: IAddSubscriptionUseCase,
        private _editSubscriptionUseCase: IEditSubscriptionUseCase,
        private _deleteSubscriptionUseCase: IDeleteSubscriptionUseCase,
        private _getSubscriptionUseCase: IGetSubscriptionUseCase
    ) { }

    async addSubscription(req: Request, res: Response): Promise<Response> {
        try {
            const subscription = await this._addSubscriptionUseCase.addSubscription(req.body);
            return res.status(StatusCode.CREATED).json({ success: true, subscription });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to add subscription",
            });
        }
    }

    async getSubscriptions(req: Request, res: Response): Promise<Response> {
        try {
            const { type, page, limit } = req.query;
            const result = await this._getSubscriptionUseCase.getSubscription(
                type as "User" | "Creator",
                Number(page) || 1,
                Number(limit) || 10
            );
            return res.status(StatusCode.OK).json({ success: true, message: "Subscriptions listed", result });
        } catch (error: unknown) {
            console.error("GetSubscriptions Error:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to fetch subscriptions",
            });
        }
    }

    async editSubscription(req: Request, res: Response): Promise<Response> {
        try {
            const { subscriptionId } = req.params;
            const result = await this._editSubscriptionUseCase.editSubscription(subscriptionId, req.body);
            return res.status(StatusCode.OK).json({ success: true, result });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to update Subscription",
            });
        }
    }

    async deleteSubscription(req: Request, res: Response): Promise<Response> {
        try {
            const { subscriptionId } = req.params;
            await this._deleteSubscriptionUseCase.deleteSubscription(subscriptionId);
            return res.status(StatusCode.OK).json({ success: true, message: "Subscription deleted Successfully" });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete",
            });
        }
    }
}
