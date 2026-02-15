import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  console.log("📥 Incoming Request");
  console.log(`${req.method} ${req.originalUrl}`);
  console.log("Time:", new Date().toISOString());

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log("📤 Response Sent");
    console.log("Status:", res.statusCode);
    console.log("Duration:", duration + "ms");
    console.log("---------------------------");
  });

  next();
};
