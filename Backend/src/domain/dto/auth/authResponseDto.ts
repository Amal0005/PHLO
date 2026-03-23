import { UserResponseDto } from "../user/userResponseDto";

export interface AuthResponseDTO {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
