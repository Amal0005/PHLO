import { UserResponseDto } from "../../dto/user/userResponseDto";

export interface IadminLoginUseCase {
  login(
    email: string,
    password: string
  ): Promise<{
     user: UserResponseDto;
        accessToken: string;
        refreshToken: string;
  }>;
    logout(adminId: string): Promise<void>;

}
