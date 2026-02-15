import { ZodObject } from "zod";
import { NextFunction, Request, Response } from "express"
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
export const validate =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        console.log('Validation Failed at:', req.originalUrl);
        console.log('Body received:', JSON.stringify(req.body, null, 2));
        console.log('Errors:', JSON.stringify(result.error.flatten().fieldErrors, null, 2));
        return res.status(StatusCode.BAD_REQUEST).json({
          message: MESSAGES.ERROR.VALIDATION_FAILED,
          errors: result.error.flatten().fieldErrors,
        });
      }

      req.body = result.data;
      next();
    };
