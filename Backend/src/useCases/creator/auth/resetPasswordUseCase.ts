import { IRedisService } from "@/domain/interface/service/IredisServices";
import { IpasswordService } from "@/domain/interface/service/IpasswordService";
import { IresetPasswordUseCase } from "@/domain/interface/creator/auth/IresetPasswordUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";


export class ResetPasswordUseCase implements IresetPasswordUseCase {
    constructor(
        private _creatorRepo: IcreatorRepository,
        private _passwordService: IpasswordService,
        private _redisService: IRedisService
    ) {}

    async reset(email: string, newPassword: string): Promise<void> {
        email = email.trim().toLowerCase();
        const verified = await this._redisService.getValue(`FP_CREATOR_VERIFIED_${email}`);
        if (!verified) throw new Error("OTP not verified");

        const hashed = await this._passwordService.hash(newPassword);
        await this._creatorRepo.updatePassword(email, hashed);

        await this._redisService.deleteValue(`FP_CREATOR_VERIFIED_${email}`);
        await this._redisService.deleteValue(`OTP_FP_CREATOR_${email}`);
    }
}
