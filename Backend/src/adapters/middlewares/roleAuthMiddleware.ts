import type { Response, NextFunction } from "express";
import { StatusCode } from "@/constants/statusCodes";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/constants/commonMessages";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(StatusCode.FORBIDDEN).json({
                success: false,
                message: MESSAGES.ROLE.NOT_AUTHORIZED
            });
        }
        next();
    };
};
