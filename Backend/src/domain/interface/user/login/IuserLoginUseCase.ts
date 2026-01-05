import { loginDto } from "../../../dto/user/auth/loginDto";
import { UserDto } from "../../../dto/user/userDto";

export interface IuserLoginUseCase {
  loginUser(user: loginDto): Promise<{
    user: UserDto;
    accessToken: string;
    refreshToken: string;
  }>;
}
