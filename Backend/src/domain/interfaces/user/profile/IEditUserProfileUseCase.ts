import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface IEditUserProfileUseCase {
  editProfile(userId: string, data: {
    name?: string;
    phone?: string;
    image?: string;
    email?: string
  }): Promise<UserResponseDto | null>
}
