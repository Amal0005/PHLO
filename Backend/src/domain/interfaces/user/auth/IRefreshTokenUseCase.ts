export interface IRefreshTokenUseCase {
    refreshToken(token: string): Promise<{ success: boolean; accessToken: string }>;
}
