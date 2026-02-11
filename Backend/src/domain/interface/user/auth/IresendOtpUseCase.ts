export interface IResendOtpUseCase {
  resend(email: string): Promise<void>;
}

