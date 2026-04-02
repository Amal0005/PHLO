import type { IVerifyEmailChangeOtpUseCase } from "@/domain/interfaces/user/profile/IVerifyEmailChangeOtpUseCase";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import { MESSAGES } from "@/constants/commonMessages";

export class VerifyEmailChangeOtpUseCase implements IVerifyEmailChangeOtpUseCase {
    constructor(private _otpService: IOTPService) {}

    async verifyEmailChangeOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        const result = await this._otpService.verifyOtp(email, otp);
        if (result === "EXPIRED") {
            throw new Error(MESSAGES.AUTH.OTP_EXPIRED);
        }
        if (result === "INVALID") {
            throw new Error(MESSAGES.AUTH.INVALID_OTP);
        }
        return { success: true, message: MESSAGES.AUTH.OTP_VERIFIED_SUCCESS };
    }
}
