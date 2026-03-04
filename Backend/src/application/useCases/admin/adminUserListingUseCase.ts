import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { IAdminUserListingUseCase } from "../../../domain/interface/admin/IadminUserListingUseCase";


export class AdminUserListingUseCase implements IAdminUserListingUseCase {
    constructor(
        private _userRepo: IUserRepository
    ) {}
    async getAllUsers(page: number, limit: number, search?: string, status?: string) {
        return this._userRepo.findAllUsers(page, limit, search, status);
    }
}
