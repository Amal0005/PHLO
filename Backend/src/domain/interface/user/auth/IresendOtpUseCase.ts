export interface IresendOtpUseCase {
  resend(email: string): Promise<void>;
}
