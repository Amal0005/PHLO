import { IGoogleLoginUseCase } from "@/domain/interface/user/auth/IGoogleLoginUseCase";
import { User } from "../../../../domain/entities/userEntities";
import { IJwtServices } from "../../../../domain/interface/service/IJwtServices";
import { verifyGoogleIdToken } from "../../../../framework/google/verifyGoogleIdToken";
import { MESSAGES } from "@/utils/commonMessages";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";


export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _jwtService: IJwtServices
  ) {}

  async execute(idToken: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {

    const googleUser = await verifyGoogleIdToken(idToken);

    let user = await this._userRepo.findByEmail(googleUser.email);

    if (!user) {
      user = await this._userRepo.createUser({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        googleVerified: true,
        role: "user",
        status: "active",
      });
    } else if (!user.image && googleUser.picture) {
      
      const updatedUser = await this._userRepo.editProfile(user._id!.toString(), { image: googleUser.picture });
      if (updatedUser) user = updatedUser;
    }



    if (!user || !user._id) {
      throw new Error(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (user.status === "blocked") {
      throw new Error(MESSAGES.AUTH.USER_BLOCKED);
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,

    };

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);
    return {
      user,
      accessToken,
      refreshToken
    }
  }
}
