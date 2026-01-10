import bcrypt from "bcryptjs";
import { CreatorLoginResponseDto } from "../../../domain/dto/creator/creatorLoginResponseDto";
import { IcreatorRepository } from "../../../domain/interface/creator/IcreatorRepository";
import { IcreatorLoginUseCase } from "../../../domain/interface/creator/login/IcreatorLoginUseCase";
import { IjwtServices } from "../../../domain/interface/service/IjwtServices";
import { AuthPayload } from "../../../domain/dto/user/authPayload";

export class CreatorLoginUseCase implements IcreatorLoginUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private IjwtService: IjwtServices
  ) {}
  async login(
    email: string,
    password: string
  ): Promise<CreatorLoginResponseDto> {
    const getEmail = email.trim().toLowerCase();
    const creator = await this._creatorRepo.findByEmail(getEmail);
    if (!creator) throw new Error("No Creators in this Email");
    if (creator.status !== "approved")
      throw new Error("Creater is still Admin's lock");
    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) throw new Error("Password is incorrect");
    const payload: AuthPayload = {email: getEmail, role: "creator", userId: creator._id!}
    const token = this.IjwtService.generateAccessToken(payload);
    return {
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
