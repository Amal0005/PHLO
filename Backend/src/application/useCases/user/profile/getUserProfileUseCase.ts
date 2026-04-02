import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";
import { UserMapper } from "@/application/mapper/user/userMapper";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IGetUserProfileUseCase } from "@/domain/interfaces/user/profile/IGetUserProfileUseCase";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
    constructor(
        private _userRepo: IUserRepository
    ) {}
    async getProfile(userId: string): Promise<UserResponseDto | null> {
        const user = await this._userRepo.findById(userId);
        return user ? UserMapper.toDto(user) : null;
    }
}
