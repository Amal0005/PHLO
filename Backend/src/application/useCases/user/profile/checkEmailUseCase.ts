import type { ICheckEmailUseCase } from "@/domain/interface/user/profile/ICheckEmailUseCase";
import type { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import type { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class CheckEmailUseCase implements ICheckEmailUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _creatorRepo: ICreatorRepository
    ) {}

    async checkEmail(userId: string, email: string): Promise<{ success: boolean; message: string }> {
        const existingUser = await this._userRepo.findByEmail(email);
        if (existingUser && existingUser._id?.toString() !== userId) {
            throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_IN_USE);
        }
        const existingCreator = await this._creatorRepo.findByEmail(email);
        if (existingCreator) {
            throw new Error(MESSAGES.AUTH.EMAIL_REGISTERED_AS_CREATOR);
        }
        return { success: true, message: MESSAGES.AUTH.EMAIL_AVAILABLE };
    }
}
