import { IpasswordService } from "@/domain/interface/service/IpasswordService";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";
import { IchangePasswordUseCase } from "@/domain/interface/user/profile/IchangepasswordUseCase";

export class ChangePasswordUseCase implements IchangePasswordUseCase {
    constructor(
        private _userRepo: IuserRepository,
        private _passwordService: IpasswordService
    ) { }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this._userRepo.findById(userId)
        if (!user) throw new Error("User not found")
            if(!user.password)throw new Error("Google Account cant change password")
        const passwordIsValid = await this._passwordService.compare(currentPassword, user.password)
        if (!passwordIsValid) throw new Error("Current password is wrong")
            const hashPassword=await this._passwordService.hash(newPassword)
        await this._userRepo.updatePassword(user.email,hashPassword)
    }
}