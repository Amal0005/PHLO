import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IresetPasswordUseCase } from "../../../domain/interface/user/auth/IresetPasswordUseCase";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";

export class ResetPasswordUseCase implements IresetPasswordUseCase{
    constructor(
        private _userRepo:IuserRepository,
        private _passwordService:IpasswordService
    ){}

    async reset(email: string, newPassword: string): Promise<void> {
        email=email.trim().toLowerCase()
        const hashed=await this._passwordService.hash(newPassword)
        await this._userRepo.updatePassword(email,hashed)
    }
}