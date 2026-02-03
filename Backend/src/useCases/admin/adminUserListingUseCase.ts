import { User } from "../../domain/entities/userEntities";
import { IadminUserListingUseCase } from "../../domain/interface/admin/IadminUserListingUseCase";
import { IuserRepository } from "../../domain/interface/user/IuserRepository";


export class AdminUserListingUseCase implements IadminUserListingUseCase {
    constructor(
        private _userRepo: IuserRepository
    ) {}
    async getAllUsers(page: number, limit: number) {
        return this._userRepo.findAllUsers(page, limit);
    }
}