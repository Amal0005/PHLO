import { email } from "zod";
import { CreatorEntity } from "../../../domain/entities/creatorEntities";
import { IcreatorRepository } from "../../../domain/interface/creator/IcreatorRepository";
import { IregisterCreatorUseCase } from "../../../domain/interface/creator/register/IregisterCreatorUseCase";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";

export class RegisterCreatorUseCase implements IregisterCreatorUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private _passwordService:IpasswordService
  ) {}
  async registerCreator(data: CreatorEntity): Promise<CreatorEntity> {
    const existing = await this._creatorRepo.findByEmail(data.email);
    if (existing) throw new Error("Creator already exists");

    if(!data.password)throw new Error("Password requires")
      const hashedPassword=await this._passwordService.hash(data.password)

    return this._creatorRepo.createCreator({ ...data,password:hashedPassword, status: "pending" });
  }
}
