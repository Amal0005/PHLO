import { IpasswordService } from "@/domain/interface/service/IpasswordService";
import { IresetPasswordUseCase } from "@/domain/interface/creator/auth/IresetPasswordUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import redis from "@/framework/redis/redisClient";


export class ResetPasswordUseCase implements IresetPasswordUseCase {
    constructor(
        private _creatorRepo: IcreatorRepository,
        private _passwordService: IpasswordService
    ) { }

    async reset(email: string, newPassword: string): Promise<void> {
        email = email.trim().toLowerCase();
        const verified = await redis.get(`FP_CREATOR_VERIFIED_${email}`);
        if (!verified) throw new Error("OTP not verified");

        const hashed = await this._passwordService.hash(newPassword);
        await this._creatorRepo.updatePassword(email, hashed);

        await redis.del(`FP_CREATOR_VERIFIED_${email}`);
        await redis.del(`OTP_FP_CREATOR_${email}`);
    }
}
