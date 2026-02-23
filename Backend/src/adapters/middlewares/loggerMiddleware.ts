import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  logger.info("Incoming Request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("Response Sent", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
