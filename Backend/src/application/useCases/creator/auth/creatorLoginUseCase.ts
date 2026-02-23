import { CreatorLoginResponseDto } from "@/domain/dto/creator/creatorLoginResponseDto";
import { IJwtServices } from "@/domain/interface/service/IJwtServices";
import { AuthPayload } from "@/domain/dto/user/authPayload";
import { IPasswordService } from "@/domain/interface/service/IPasswordService";
import { AuthError } from "@/domain/errors/authError";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { ICreatorLoginUseCase } from "@/domain/interface/creator/auth/ICreatorLoginUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";


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
      },
      token,
      refreshToken
    };
  }

}

