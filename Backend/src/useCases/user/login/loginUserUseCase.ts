import { loginDto } from "../../../domain/dto/user/auth/loginDto";
import { UserDto } from "../../../domain/dto/user/auth/userDto";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserLoginUseCase } from "../../../domain/interface/user/login/IuserLoginUseCase";

export class userLoginUserUseCase implements IuserLoginUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _passwordService:IpasswordService
  
  ) {}
  async loginUser(user: loginDto): Promise<UserDto> {

    const existingUser = await this._userRepo.findByEmail(user.email);

    if (!existingUser) throw new Error("Email not found");
    const isPasswordMatch = await this._passwordService.compare(
      user.password,
      existingUser.password
    )

    if (!isPasswordMatch) throw new Error("Password does not match");
    const { password, ...safeUser } = existingUser;

    return safeUser as UserDto;
  }
}
