import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface IAdminLoginUseCase {
  login(
    email: string,
    password: string
  ): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}

