export interface IOTPService {
  generateOtp(identifier: string): Promise<string>;
  saveOtp(identifier: string, otp: string): Promise<void>;
  verifyOtp(identifier: string, otp: string): Promise<"VERIFIED" | "INVALID" | "EXPIRED">
}
