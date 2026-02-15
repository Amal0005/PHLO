import { User } from "@/domain/entities/userEntities";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { IGetUserProfileUseCase } from "@/domain/interface/user/profile/IGetUserProfileUseCase";

export class GetUserProfileUseCase implements IGetUserProfileUseCase{
    constructor(
        private _userRepo:IUserRepository
    ){}
    async getProfile(userId: string): Promise<User | null> {
        if(!userId)throw new Error("User Id is required")
            const user=await this._userRepo.findById(userId)
        if(!user)throw new Error("User not found")
            return user
    }
}
