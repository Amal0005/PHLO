import { Response, NextFunction } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthRequest } from "./jwtAuthMiddleware";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(StatusCode.FORBIDDEN).json({
                success: false,
                message: "You are not authorized to access this resource"
            });
        }
        next();
    };
};
