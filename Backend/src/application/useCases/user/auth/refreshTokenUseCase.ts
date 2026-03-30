import type { IRefreshTokenUseCase } from "@/domain/interface/user/auth/IRefreshTokenUseCase";
import type { IJwtServices } from "@/domain/interface/service/IJwtServices";
import { MESSAGES } from "@/constants/commonMessages";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(private _jwtService: IJwtServices) {}

    async refreshToken(token: string): Promise<{ success: boolean; accessToken: string }> {
        try {
            const decoded = this._jwtService.verifyToken(token);
            
            const newPayload = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };

            const newAccessToken = this._jwtService.generateAccessToken(newPayload);
            return { success: true, accessToken: newAccessToken };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.AUTH.INVALID_REFRESH_TOKEN;
            throw new Error(message);
        }
    }
}
