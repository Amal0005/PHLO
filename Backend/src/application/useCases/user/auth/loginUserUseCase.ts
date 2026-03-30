import { UserMapper } from "@/application/mapper/user/userMapper";
import type { loginDto } from "@/domain/dto/user/loginDto";
import type { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import type { IJwtServices } from "@/domain/interface/service/IJwtServices";
import type { IPasswordService } from "@/domain/interface/service/IPasswordService";
import type { IUserLoginUseCase } from "@/domain/interface/user/auth/IUserLoginUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";


export class userLoginUserUseCase implements IUserLoginUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _passwordService: IPasswordService,
    private _jwtService: IJwtServices
  ) {}

  async loginUser(user: loginDto):  Promise<{
      user: UserResponseDto;
      accessToken: string;
      refreshToken: string;
    }> {
    const existingUser = await this._userRepo.findByEmail(user.email);
    if (!existingUser) throw new Error(MESSAGES.AUTH.USER_NOT_FOUND);

    if (existingUser.status === "blocked") {
      throw new Error(MESSAGES.AUTH.ACCOUNT_BLOCKED);
    }

    if (!existingUser.password)
      throw new Error(MESSAGES.AUTH.GOOGLE_LOGIN_REQUIRED);

    const isPasswordMatch = await this._passwordService.compare(
      user.password,
      existingUser.password
    );
    if (!isPasswordMatch)
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const userDto = UserMapper.toDto(existingUser);

    const payload = {
      userId: userDto._id,
      role: userDto.role,
      email: userDto.email
    };

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);

    return {
      user: userDto,
      accessToken,
      refreshToken
    };
  }
}

