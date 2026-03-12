import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/subscription/IGetSubscriptionUseCase";
import { IBuySubscriptionUseCase } from "@/domain/interface/creator/payment/IBuySubscriptionUseCase";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/constants/statusCodes";
import { Request, Response } from "express";

export class CreatorSubscriptionController {
  constructor(
    private _buySubscriptionUseCase: IBuySubscriptionUseCase,
    private _getSubscriptionUseCase: IGetSubscriptionUseCase,
  ) { }

  async getSubscriptions(req: Request, res: Response) {
    try {
      const { page, limit, search } = req.query;
      const result = await this._getSubscriptionUseCase.getSubscription(
        Number(page) || 1,
        Number(limit) || 10,
        true,
        search as string,
      );
      return res.status(StatusCode.OK).json(result);
    } catch (error: unknown) {
      const statusCode =
        error instanceof AppError
          ? error.statusCode
          : StatusCode.INTERNAL_SERVER_ERROR;
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      return res.status(statusCode).json({ message });
    }
  }

  async buySubscription(req: AuthRequest, res: Response) {
    try {
      const { subscriptionId, successUrl, cancelUrl } = req.body;
      const result = await this._buySubscriptionUseCase.buySubscription(
        req.user!.userId,
        subscriptionId,
        successUrl,
        cancelUrl,
      );
      return res.status(StatusCode.OK).json(result);
    } catch (error: unknown) {
      const statusCode =
        error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      return res.status(statusCode).json({ message });
    }
  }
}
