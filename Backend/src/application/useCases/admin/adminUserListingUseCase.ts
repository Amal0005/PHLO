import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { IAdminUserListingUseCase } from "../../../domain/interface/admin/IAdminUserListingUseCase";


export class AdminUserListingUseCase implements IAdminUserListingUseCase {
    constructor(
        private _userRepo: IUserRepository
    ) {}
    async getAllUsers(page: number, limit: number) {
        return this._userRepo.findAllUsers(page, limit);
    }
}
