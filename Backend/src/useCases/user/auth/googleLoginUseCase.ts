import { User } from "../../../domain/entities/userEntities";
import { IjwtServices } from "../../../domain/interface/service/IjwtServices";
import { IgoogleLoginUseCase } from "../../../domain/interface/user/auth/IgoogleLoginUseCase";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { verifyGoogleIdToken } from "../../../framework/google/verifyGoogleIdToken";


   export class GoogleLoginUseCase implements IgoogleLoginUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _jwtService: IjwtServices
  ) {}

  async execute(idToken: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {

    // 1️⃣ Verify Google ID token
    const googleUser = await verifyGoogleIdToken(idToken);

    // 2️⃣ Find user by email
    let user = await this._userRepo.findByEmail(googleUser.email);

    // 3️⃣ Create user if not exists
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
  userId: user._id,
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
