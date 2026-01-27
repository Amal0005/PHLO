import { IOTPService } from "@/domain/interface/service/IotpServices";
import { IVerifyForgotOtpUseCase } from "@/domain/interface/creator/auth/IverifyForgotOtpUseCase";
import redis from "@/framework/redis/redisClient";


export class VerifyForgotOtpUseCase implements IVerifyForgotOtpUseCase {
    constructor(private _otpService: IOTPService) { }

    async verify(email: string, otp: string): Promise<void> {
        email = email.trim().toLowerCase();
        const status = await this._otpService.verifyOtp(`FP_CREATOR_${email}`, otp);

        if (status === "EXPIRED") throw new Error("OTP expired");
        if (status === "INVALID") throw new Error("Invalid OTP");

        await redis.set(`FP_CREATOR_VERIFIED_${email}`, "1", { EX: 300 });
    }
}
