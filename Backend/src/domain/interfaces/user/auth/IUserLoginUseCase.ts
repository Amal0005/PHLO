import type { loginDto } from "@/domain/dto/user/loginDto";
import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface IUserLoginUseCase {
  loginUser(user: loginDto): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}
