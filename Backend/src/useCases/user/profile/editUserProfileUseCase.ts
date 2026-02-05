import { User } from "@/domain/entities/userEntities";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";
import { IeditUserProfileUseCase } from "@/domain/interface/user/profile/IeditUserProfileUseCase";

export class EditUserProfileUsecase implements IeditUserProfileUseCase{
    constructor(
        private _userRepo:IuserRepository
    ){}
    async editProfile(userId: string, data: { name?: string; phone?: string; image?: string; }): Promise<User | null> {
        if(!userId)throw new Error("userID is required")
            if(!data)throw new Error("User dara is required")
                const newUser=await this._userRepo.editProfile(userId,data)
            return newUser
    }
}