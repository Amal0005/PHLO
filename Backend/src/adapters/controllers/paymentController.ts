import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import type { IHandleStripeWebhookUseCase } from "@/domain/interface/payment/IHandleStripeWebhookUseCase";

export class PaymentController {
  constructor(
    private _handleStripeWebhookUseCase: IHandleStripeWebhookUseCase,
  ) {}

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) {
      res.status(StatusCode.BAD_REQUEST).send("Missing stripe-signature header");
      return;
    }

    try {
      const payload = (req as Request & { rawBody?: Buffer | string }).rawBody || req.body;
      const result = await this._handleStripeWebhookUseCase.handleWebhook(payload, sig);
      res.status(StatusCode.OK).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(StatusCode.BAD_REQUEST).send(message);
    }
  }
}

