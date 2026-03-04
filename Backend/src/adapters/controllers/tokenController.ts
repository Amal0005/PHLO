import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IJwtServices } from "@/domain/interface/service/IJwtServices";
import { MESSAGES } from "@/utils/commonMessages";

export class TokenController {
    constructor(private _jwtService: IJwtServices) { }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies["refreshToken"];
            if (!refreshToken) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING
                });
            }

            const decoded = this._jwtService.verifyToken(refreshToken);

            const newPayload = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };

            const newAccessToken = this._jwtService.generateAccessToken(newPayload);

            return res.status(StatusCode.OK).json({
                success: true,
                accessToken: newAccessToken
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.INVALID_REFRESH_TOKEN;
            console.error("Refresh token error:", error);
            return res.status(StatusCode.UNAUTHORIZED).json({
                success: false,
                message
            });
        }
    }
}

