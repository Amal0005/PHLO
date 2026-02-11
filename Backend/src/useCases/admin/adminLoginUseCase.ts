import { UserResponseDto } from "../../domain/dto/user/userResponseDto";
import { IAdminLoginUseCase } from "../../domain/interface/admin/IAdminLoginUseCase";
import { IJwtServices } from "../../domain/interface/service/IJwtServices";
import { IPasswordService } from "../../domain/interface/service/IPasswordService";
import { IUserRepository } from "../../domain/interface/user/IUserRepository";

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _passwordService: IPasswordService,
    private _jwtService: IJwtServices
  ) {}

  async login(
    email: string,
    password: string
  ): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("Admin Not Found");
    if (user.role !== "admin") throw new Error("No Access");
    const isMatch = await this._passwordService.compare(
      password,
      user.password as string
    );
    if (!isMatch) throw new Error("Password is not Match");
    const accessToken = this._jwtService.generateAccessToken({
      userId: user._id!,
      role: user.role,
      email: user.email,
    });
    const refreshToken = this._jwtService.generateRefreshToken({
      userId: user._id as string,
      role: user.role,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id!,
        email: user.email,
        role: "admin",
        name: user.name,
        googleVerified: user.googleVerified,
        status: user.status,
      },
    };
  }
}

