import { loginDto } from "../../../domain/dto/user/auth/loginDto";
import { IjwtServices } from "../../../domain/interface/service/IjwtServices";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserLoginUseCase } from "../../../domain/interface/user/login/IuserLoginUseCase";
import { UserMapper } from "../../../domain/mapper/user/userMapper";

export class userLoginUserUseCase implements IuserLoginUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _passwordService: IpasswordService,
    private _jwtService: IjwtServices
  ) {}

  async loginUser(user: loginDto) {
    const existingUser = await this._userRepo.findByEmail(user.email);
    if (!existingUser) throw new Error("Email not found");

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
