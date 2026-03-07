import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import { IRedisService } from "@/domain/interface/service/IRedisServices";
import { IOTPService } from "@/domain/interface/service/IOtpServices";
import { IVerifyCreatorOtpUseCase } from "@/domain/interface/creator/auth/IVerifyCreatorOtpUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class VerifyCreatorOtpUseCase implements IVerifyCreatorOtpUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _otpService: IOTPService,
        private _redisService: IRedisService
    ) {}

    async verifyOtp(email: string, otp: string): Promise<CreatorResponseDto> {
        email = email.trim().toLowerCase();

        const result = await this._otpService.verifyOtp(email, otp);
        if (result === "EXPIRED") throw new Error("Otp expired");
        if (result === "INVALID") throw new Error("Invalid Otp");

        const pending = await this._redisService.getValue(`PENDING_CREATOR_${email}`);
        if (!pending) {
            await this._redisService.setValue(`VERIFIED_CREATOR_EMAIL_${email}`, "true", 900);
            return { email } as CreatorResponseDto;
        }

        const creatorData = JSON.parse(pending);
        const createdCreator = await this._creatorRepo.createCreator(creatorData);

        await this._redisService.deleteValue(`PENDING_CREATOR_${email}`);

        return CreatorMapper.toDto(createdCreator);
    }
}

