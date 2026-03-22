export interface IVerifyEmailChangeOtpUseCase {
    verifyEmailChangeOtp(email: string, otp: string): Promise<{ success: boolean; message: string }>;
}
