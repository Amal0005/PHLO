import { User } from "../../domain/entities/userEntities";
import { IadminUserListingUseCase } from "../../domain/interface/admin/IadminUserListingUseCase";
import { IuserRepository } from "../../domain/interface/user/IuserRepository";


export class AdminUserListingUseCase implements IadminUserListingUseCase {
    constructor(
        private _userRepo: IuserRepository
    ) { }
    async getAllUsers(): Promise<User[]> {
        const users = await this._userRepo.findAllUsers()
        return users
    }
}