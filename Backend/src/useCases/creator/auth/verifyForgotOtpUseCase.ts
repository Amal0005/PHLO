import { IRedisService } from "@/domain/interface/service/IRedisServices";
import { IOTPService } from "@/domain/interface/service/IOtpServices";
import { IVerifyForgotOtpUseCase } from "@/domain/interface/creator/auth/IVerifyForgotOtpUseCase";
import { MESSAGES } from "@/utils/commonMessages";


export class VerifyForgotOtpUseCase implements IVerifyForgotOtpUseCase {
    constructor(
        private _otpService: IOTPService,
        private _redisService: IRedisService
    ) { }

    async verify(email: string, otp: string): Promise<void> {
        email = email.trim().toLowerCase();
        const status = await this._otpService.verifyOtp(`FP_CREATOR_${email}`, otp);

        if (status === "EXPIRED") throw new Error(MESSAGES.AUTH.OTP_EXPIRED);
        if (status === "INVALID") throw new Error(MESSAGES.AUTH.INVALID_OTP);

        await this._redisService.setValue(`FP_CREATOR_VERIFIED_${email}`, "1", 300);
    }
}

