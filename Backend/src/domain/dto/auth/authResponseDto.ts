import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface AuthResponseDTO {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
