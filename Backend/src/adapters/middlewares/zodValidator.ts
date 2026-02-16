import { ZodType } from "zod";
import { NextFunction, Request, Response } from "express"
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
export const validate =
  (schema: ZodType) =>
    (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(StatusCode.BAD_REQUEST).json({
          message: MESSAGES.ERROR.VALIDATION_FAILED,
          errors: result.error.flatten().fieldErrors,
        });
      }

      req.body = result.data;
      next();
    };
