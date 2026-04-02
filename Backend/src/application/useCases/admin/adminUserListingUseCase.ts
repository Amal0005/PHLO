import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";
import { UserMapper } from "@/application/mapper/user/userMapper";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IAdminUserListingUseCase } from "@/domain/interfaces/admin/IAdminUserListingUseCase";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

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
