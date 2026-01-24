import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IregisterCreatorUseCase } from "@/domain/interface/creator/register/IregisterCreatorUseCase";
import { IpasswordService } from "@/domain/interface/service/IpasswordService";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";


export class RegisterCreatorUseCase implements IregisterCreatorUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private _passwordService:IpasswordService,
    private _userRepo:IuserRepository
  ) {}
  async registerCreator(data: CreatorEntity): Promise<CreatorEntity> {
    const existing = await this._creatorRepo.findByEmail(data.email);
    if (existing) throw new Error("Creator already exists");

    const existingUser=await this._userRepo.findByEmail(data.email)
    if(existingUser)throw new Error("This email is already registered as a user")
    if(!data.password)throw new Error("Password requires")
      const hashedPassword=await this._passwordService.hash(data.password)

    return this._creatorRepo.createCreator({ ...data,password:hashedPassword, status: "pending" });
  }
  async checkExists(email: string): Promise<void> {
    const existing = await this._creatorRepo.findByEmail(email);
    if(existing){
      throw new Error("Email already in use")
  }
}
}