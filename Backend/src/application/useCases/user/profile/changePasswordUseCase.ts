import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IPasswordService } from "@/domain/interfaces/service/IPasswordService";
import type { IChangePasswordUseCase } from "@/domain/interfaces/user/profile/IChangepasswordUseCase";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _passwordService: IPasswordService
    ) {}

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this._userRepo.findById(userId)
        if (!user) throw new Error("User not found")
        if (!user.password) throw new Error("Google Account cant change password")
        const passwordIsValid = await this._passwordService.compare(currentPassword, user.password)
        if (!passwordIsValid) throw new Error("Current password is wrong")
        const hashPassword = await this._passwordService.hash(newPassword)
        await this._userRepo.updatePassword(user.email, hashPassword)
    }
}
