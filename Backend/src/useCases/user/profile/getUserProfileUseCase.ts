import { User } from "@/domain/entities/userEntities";
import { IgetUserProfileUseCase } from "@/domain/interface/user/profile/IgetUserProfileUseCase";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";

export class GetUserProfileUseCase implements IgetUserProfileUseCase{
    constructor(
        private _userRepo:IuserRepository
    ){}
    async getProfile(userId: string): Promise<User | null> {
        if(!userId)throw new Error("User Id is required")
            const user=await this._userRepo.findById(userId)
        if(!user)throw new Error("User not found")
            return user
    }
}