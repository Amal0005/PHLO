import { loginDto } from "../../../dto/user/loginDto";
import { UserResponseDto } from "../../../dto/user/userResponseDto";

export interface IUserLoginUseCase {
  loginUser(user: loginDto): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}

