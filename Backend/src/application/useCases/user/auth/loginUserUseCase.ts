import { UserMapper } from "@/application/mapper/user/userMapper";
import { loginDto } from "@/domain/dto/user/loginDto";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { IJwtServices } from "@/domain/interface/service/IJwtServices";
import { IPasswordService } from "@/domain/interface/service/IPasswordService";
import { IUserLoginUseCase } from "@/domain/interface/user/auth/IUserLoginUseCase";
import { MESSAGES } from "@/utils/commonMessages";

export class userLoginUserUseCase implements IUserLoginUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _passwordService: IPasswordService,
    private _jwtService: IJwtServices
  ) {}

  async loginUser(user: loginDto) {
    const existingUser = await this._userRepo.findByEmail(user.email);
    if (!existingUser) throw new Error(MESSAGES.AUTH.USER_NOT_FOUND);

    if (existingUser.status === "blocked") {
      throw new Error(MESSAGES.AUTH.ACCOUNT_BLOCKED);
    }

    if (!existingUser.password)
      throw new Error("Google Login to continue");

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

