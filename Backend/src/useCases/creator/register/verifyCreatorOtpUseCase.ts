import { IRedisService } from "@/domain/interface/service/IredisServices";
import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IOTPService } from "@/domain/interface/service/IotpServices";
import { IverifyCreatorOtpUseCase } from "@/domain/interface/creator/register/IverifyCreatorOtpUseCase";

export class VerifyCreatorOtpUseCase implements IverifyCreatorOtpUseCase {
    constructor(
        private _creatorRepo: IcreatorRepository,
        private _otpService: IOTPService,
        private _redisService: IRedisService
    ) {}

    async verifyOtp(email: string, otp: string): Promise<CreatorEntity> {
        email = email.trim().toLowerCase();

        const result = await this._otpService.verifyOtp(email, otp);
        if (result === "EXPIRED") throw new Error("Otp expired");
        if (result === "INVALID") throw new Error("Invalid Otp");

        const pending = await this._redisService.getValue(`PENDING_CREATOR_${email}`);
        if (!pending) {
            await this._redisService.setValue(`VERIFIED_CREATOR_EMAIL_${email}`, "true", 900);
            return { email } as CreatorEntity;
        }

        const creatorData = JSON.parse(pending);
        const createdCreator = await this._creatorRepo.createCreator(creatorData);

        await this._redisService.deleteValue(`PENDING_CREATOR_${email}`);

        return createdCreator;
    }
}
