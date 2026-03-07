import { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface IGoogleLoginUseCase {
  login(
    idToken: string
  ): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}

