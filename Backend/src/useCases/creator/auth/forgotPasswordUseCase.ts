import { IMailService } from "@/domain/interface/service/ImailServices";
import { IOTPService } from "@/domain/interface/service/IotpServices";
import { IforgotPasswordUseCase } from "@/domain/interface/creator/auth/IforgotPasswordUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import redis from "@/framework/redis/redisClient";


export class ForgotPasswordUseCase implements IforgotPasswordUseCase {
    constructor(
        private _creatorRepo: IcreatorRepository,
        private _otpService: IOTPService,
        private _mailService: IMailService
    ) { }

    async sendOtp(email: string): Promise<void> {
        email = email.trim().toLowerCase();
        const creator = await this._creatorRepo.findByEmail(email);
        if (!creator) throw new Error("This creator does not exist");

        const cooldownKey = `FP_CREATOR_COOLDOWN_${email}`;
        const cooldown = await redis.ttl(cooldownKey);
        if (cooldown > 0) throw new Error(`Please wait ${cooldown} seconds before requesting again`);

        const otp = await this._otpService.generateOtp(`FP_CREATOR_${email}`);
        console.log(otp);

        await this._mailService.sendMail(
            email,
            "Reset Your Password",
            `<h2>Password Reset OTP</h2>
       <p style="font-size:18px;font-weight:bold">${otp}</p>
       <p>This OTP expires in 1 minute.</p>`
        );
        await redis.set(cooldownKey, "1", { EX: 60 });
    }
}
