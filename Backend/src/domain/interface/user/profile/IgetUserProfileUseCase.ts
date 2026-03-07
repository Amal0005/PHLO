import { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface IGetUserProfileUseCase {
    getProfile(userId: string): Promise<UserResponseDto | null>
}

