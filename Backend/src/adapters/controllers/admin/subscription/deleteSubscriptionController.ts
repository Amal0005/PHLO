import { AppError } from "@/domain/errors/appError";
import { IDeleteSubscriptionUseCase } from "@/domain/interface/admin/IDeleteSubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class DeleteSubscriptionController {
  constructor(private _deleteSubscriptionUseCase: IDeleteSubscriptionUseCase) {}
  async deleteSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      await this._deleteSubscriptionUseCase.deleteSubscription(subscriptionId);
      return res
        .status(StatusCode.OK)
        .json({ sussess: true, message: "Subscription deleted Successfully" });
    } catch (error: unknown) {
      const statusCode =
        error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res
        .status(statusCode)
        .json({
          success: false,
          message: error instanceof Error ? error.message : "Failed to delete",
        });
    }
  }
}
