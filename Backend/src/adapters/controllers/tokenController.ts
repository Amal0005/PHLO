import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { IjwtServices } from "@/domain/interface/service/IjwtServices";

export class TokenController {
    constructor(private _jwtService: IjwtServices) { }

    async refreshToken(req: Request, res: Response) {
        try {
            const url = req.originalUrl;
            let cookieName = "userRefreshToken";
            if (url.includes("/admin")) cookieName = "adminRefreshToken";
            else if (url.includes("/creator")) cookieName = "creatorRefreshToken";

            const refreshToken = req.cookies[cookieName];
            if (!refreshToken) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Refresh token missing"
                });
            }

            // Verify refresh token
            const decoded = this._jwtService.verifyToken(refreshToken);

            // Generate new access token
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
        } catch (error: any) {
            console.error("Refresh token error:", error);
            return res.status(StatusCode.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }
    }
}
