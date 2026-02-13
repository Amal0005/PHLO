import { IRedisService } from "@/domain/interface/service/IRedisServices";
import { IPasswordService } from "@/domain/interface/service/IPasswordService";
import { IResetPasswordUseCase } from "@/domain/interface/creator/auth/IResetPasswordUseCase";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { MESSAGES } from "@/utils/commonMessages";


export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _passwordService: IPasswordService,
        private _redisService: IRedisService
    ) { }

    async reset(email: string, newPassword: string): Promise<void> {
        email = email.trim().toLowerCase();
        const verified = await this._redisService.getValue(`FP_CREATOR_VERIFIED_${email}`);
        if (!verified) throw new Error(MESSAGES.AUTH.OTP_EXPIRED);

        const hashed = await this._passwordService.hash(newPassword);
        await this._creatorRepo.updatePassword(email, hashed);

        await this._redisService.deleteValue(`FP_CREATOR_VERIFIED_${email}`);
        await this._redisService.deleteValue(`OTP_FP_CREATOR_${email}`);
    }
}

