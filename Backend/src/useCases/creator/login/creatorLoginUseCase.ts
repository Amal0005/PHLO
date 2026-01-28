import { CreatorLoginResponseDto } from "@/domain/dto/creator/creatorLoginResponseDto";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IcreatorLoginUseCase } from "@/domain/interface/creator/login/IcreatorLoginUseCase";
import { IjwtServices } from "@/domain/interface/service/IjwtServices";
import { AuthPayload } from "@/domain/dto/user/authPayload";
import { IpasswordService } from "@/domain/interface/service/IpasswordService";
import { AuthError } from "@/domain/errors/authError";


export class CreatorLoginUseCase implements IcreatorLoginUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private IjwtService: IjwtServices,
    private _passwordService: IpasswordService,
  ) {}
  async login(
    email: string,
    password: string,
  ): Promise<CreatorLoginResponseDto> {
    const getEmail = email.trim().toLowerCase();
    const creator = await this._creatorRepo.findByEmail(getEmail);
    console.log(creator?.password);
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
}    const payload: AuthPayload = {
      email: getEmail,
      role: "creator",
      userId: creator._id!,
    };
    const token = this.IjwtService.generateAccessToken(payload);
    return {
        status: "approved",

      creator: {
        id: creator._id as string,
        fullName: creator.fullName,
        email: creator.email,
        role: "creator",
      },
      token,
    };
  }
  
}
