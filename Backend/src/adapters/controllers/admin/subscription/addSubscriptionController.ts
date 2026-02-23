import { AppError } from "@/domain/errors/appError";
import { IAddSubscriptionUseCase } from "@/domain/interface/admin/subscription/IAddSubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class AddSubscriptionController {
  constructor(private _addSubscriptionUseCase: IAddSubscriptionUseCase) {}
  async addSubscription(req: Request, res: Response) {
    try {
      const subscription = await this._addSubscriptionUseCase.addSubscription(
        req.body,
      );
      return res
        .status(StatusCode.CREATED)
        .json({ success: true, subscription });
    } catch (error: unknown) {
      const statusCode =
        error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to add subscription",
      });
    }
  }
}
