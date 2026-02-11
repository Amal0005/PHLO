import { CreatorLoginResponseDto } from "@/domain/dto/creator/creatorLoginResponseDto";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { ICreatorLoginUseCase } from "@/domain/interface/creator/login/ICreatorLoginUseCase";
import { IJwtServices } from "@/domain/interface/service/IJwtServices";
import { AuthPayload } from "@/domain/dto/user/authPayload";
import { IPasswordService } from "@/domain/interface/service/IPasswordService";
import { AuthError } from "@/domain/errors/authError";


export class CreatorLoginUseCase implements ICreatorLoginUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private IjwtService: IJwtServices,
    private _passwordService: IPasswordService,
  ) {}
  async login(
    email: string,
    password: string,
  ): Promise<CreatorLoginResponseDto> {
    const getEmail = email.trim().toLowerCase();
    const creator = await this._creatorRepo.findByEmail(getEmail);
    if (!creator) {
      throw new AuthError("Invalid email or password", 401);
    } if (creator.status === 'pending') {
      return {
        status: 'pending',
        message: 'Your application is under review'
      };
    }
    if (creator.status === 'rejected') {
      return {
        status: 'rejected',
        message: 'Your application was rejected',
        reason: creator.rejectionReason
      };

    }
    if (creator.status === "blocked") {
      throw new AuthError(
        "Your account blocked by admin",
        403,
        { status: "blocked" }
      );
    }
    const isMatch = await this._passwordService.compare(
      password,
      creator.password,
    );
    if (!isMatch) {
      throw new AuthError("Invalid email or password", 401);
    } const payload: AuthPayload = {
      email: getEmail,
      role: "creator",
      userId: creator._id!,
    };
    const token = this.IjwtService.generateAccessToken(payload);
    const refreshToken = this.IjwtService.generateRefreshToken(payload);

    return {
      status: "approved",

      creator: {
        id: creator._id as string,
        fullName: creator.fullName,
        email: creator.email,
        role: "creator",
      },
      token,
      refreshToken
    };
  }

}

