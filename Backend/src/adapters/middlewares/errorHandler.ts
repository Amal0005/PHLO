import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let message = "Internal Server Error";
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

  res.status(500).json({
    success: false,
    message,
  });
};
