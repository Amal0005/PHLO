import { loginDto } from "../../../domain/dto/user/loginDto";
import { IJwtServices } from "../../../domain/interface/service/IJwtServices";
import { IPasswordService } from "../../../domain/interface/service/IPasswordService";
import { IUserRepository } from "../../../domain/interface/user/IUserRepository";
import { IUserLoginUseCase } from "../../../domain/interface/user/auth/IUserLoginUseCase";
import { UserMapper } from "../../../adapters/mapper/user/userMapper";

export class userLoginUserUseCase implements IUserLoginUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _passwordService: IPasswordService,
    private _jwtService: IJwtServices
  ) {}

  async loginUser(user: loginDto) {
    const existingUser = await this._userRepo.findByEmail(user.email);
    if (!existingUser) throw new Error("Email not found");

    if (existingUser.status === "blocked") {
      throw new Error("Your account blocked by admin");
    }

    if (!existingUser.password)
      throw new Error("Google Login to continue");

    const isPasswordMatch = await this._passwordService.compare(
      user.password,
      existingUser.password
    );
    if (!isPasswordMatch)
      throw new Error("Password does not match");

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

