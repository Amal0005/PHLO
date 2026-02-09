export interface IresendCreatorOtpUseCase {
    resendOtp(email: string): Promise<void>;
}
