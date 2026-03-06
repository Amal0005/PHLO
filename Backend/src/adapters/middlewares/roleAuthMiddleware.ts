import { Response, NextFunction } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthRequest } from "./jwtAuthMiddleware";
import { MESSAGES } from "@/utils/commonMessages";

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
