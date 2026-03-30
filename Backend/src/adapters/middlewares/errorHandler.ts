import type { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let message = MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
  let stack: string | undefined;

  if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  logger.error("Unhandled Error", {
    message,
    stack,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
  });
};
