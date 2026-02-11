import { User } from "../../../domain/entities/userEntities";
import { IJwtServices } from "../../../domain/interface/service/IJwtServices";
import { IGoogleLoginUseCase } from "../../../domain/interface/user/auth/IGoogleLoginUseCase";
import { IUserRepository } from "../../../domain/interface/user/IUserRepository";
import { verifyGoogleIdToken } from "../../../framework/google/verifyGoogleIdToken";


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
    }



if (!user || !user._id) {
  throw new Error("User not found");
}

if (user.status === "blocked") {
  throw new Error("User is blocked");
}

const payload = {
  userId: user._id.toString(),
  role: user.role,
  email: user.email,
  
};

const accessToken = this._jwtService.generateAccessToken(payload);
  const refreshToken = this._jwtService.generateRefreshToken(payload);
  return{
    user,
    accessToken,
    refreshToken
  }
  }
}

