import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IOTPService } from "@/domain/interface/service/IotpServices";
import { IverifyCreatorOtpUseCase } from "@/domain/interface/creator/register/IverifyCreatorOtpUseCase";
import redis from "@/framework/redis/redisClient";

export class VerifyCreatorOtpUseCase implements IverifyCreatorOtpUseCase {
    constructor(
        private _creatorRepo: IcreatorRepository,
        private _otpService: IOTPService
    ) { }

    async verifyOtp(email: string, otp: string): Promise<CreatorEntity> {
        email = email.trim().toLowerCase();

        const result = await this._otpService.verifyOtp(email, otp);
        if (result === "EXPIRED") throw new Error("Otp expired");
        if (result === "INVALID") throw new Error("Invalid Otp");

        const pending = await redis.get(`PENDING_CREATOR_${email}`);
        if (!pending) {
            await redis.set(`VERIFIED_CREATOR_EMAIL_${email}`, "true", { EX: 900 });
            return { email } as CreatorEntity;
        }

        const creatorData = JSON.parse(pending);
        const createdCreator = await this._creatorRepo.createCreator(creatorData);

        await redis.del(`PENDING_CREATOR_${email}`);

        return createdCreator;
    }
}
