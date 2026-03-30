import type { CreatorLoginResponseDto } from "@/domain/dto/creator/creatorLoginResponseDto";
import type { IJwtServices } from "@/domain/interface/service/IJwtServices";
import type { AuthPayload } from "@/domain/dto/user/authPayload";
import type { IPasswordService } from "@/domain/interface/service/IPasswordService";
import { AuthError } from "@/domain/errors/authError";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import type { ICreatorLoginUseCase } from "@/domain/interface/creator/auth/ICreatorLoginUseCase";
import type { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";


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
      throw new AuthError(MESSAGES.AUTH.INVALID_CREDENTIALS, StatusCode.UNAUTHORIZED);
    } if (creator.status === 'pending') {
      return {
        status: 'pending',
        message: MESSAGES.AUTH.APPLICATION_UNDER_REVIEW
      };
    }
    if (creator.status === 'rejected') {
      return {
        status: 'rejected',
        message: MESSAGES.AUTH.APPLICATION_REJECTED,
        reason: creator.rejectionReason
      };

    }
    if (creator.status === "blocked") {
      throw new AuthError(
        MESSAGES.AUTH.ACCOUNT_BLOCKED,
        StatusCode.FORBIDDEN,
        { status: "blocked" }
      );
    }
    const isMatch = await this._passwordService.compare(
      password,
      creator.password,
    );
    if (!isMatch) {
      throw new AuthError(MESSAGES.AUTH.INVALID_CREDENTIALS, StatusCode.UNAUTHORIZED);
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
        subscription: creator.subscription,
      },
      token,
      refreshToken
    };
  }

}

