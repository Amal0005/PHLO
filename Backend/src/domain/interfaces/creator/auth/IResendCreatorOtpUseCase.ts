export interface IResendCreatorOtpUseCase {
    resendOtp(email: string): Promise<void>;
}

