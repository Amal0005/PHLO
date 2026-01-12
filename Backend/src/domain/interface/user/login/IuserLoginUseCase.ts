import { loginDto } from "../../../dto/user/loginDto";
import { UserResponseDto } from "../../../dto/user/userResponseDto";

export interface IuserLoginUseCase {
  loginUser(user: loginDto): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }>;
}
