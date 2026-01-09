import { email } from "zod";
import { CreatorEntity } from "../../../domain/entities/creatorEntities";
import { IcreatorRepository } from "../../../domain/interface/creator/IcreatorRepository";
import { IregisterCreatorUseCase } from "../../../domain/interface/creator/register/IregisterCreatorUseCase";

export class RegisterCreatorUseCase implements IregisterCreatorUseCase {
  constructor(private _creatorRepo: IcreatorRepository) {}
  async registerCreator(data: CreatorEntity): Promise<CreatorEntity> {
    const existing = await this._creatorRepo.findByEmail(data.email);
    if (existing) throw new Error("Creator already exists");
    return this._creatorRepo.createCreator({ ...data, status: "pending" });
  }
}
