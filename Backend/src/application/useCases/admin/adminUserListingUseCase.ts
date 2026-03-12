import { UserResponseDto } from "@/domain/dto/user/userResponseDto";
import { UserMapper } from "@/application/mapper/user/userMapper";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { IAdminUserListingUseCase } from "../../../domain/interface/admin/IadminUserListingUseCase";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class AdminUserListingUseCase implements IAdminUserListingUseCase {
    constructor(
        private _userRepo: IUserRepository
    ) {}
    async getAllUsers(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<UserResponseDto>> {
        const result = await this._userRepo.findAllUsers(page, limit, search, status);
        return {
            ...result,
            data: result.data.map(user => UserMapper.toDto(user))
        };
    }
}
