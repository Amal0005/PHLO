import { ICheckCreatorExistsUseCase } from "@/domain/interface/creator/register/ICheckCreatorExistsUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";

export class CheckCreatorExistsUseCase implements ICheckCreatorExistsUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private _userRepo: IUserRepository
  ) {}

  async checkExists(email: string, phone: string): Promise<void> {
    const existingCreatorByEmail = await this._creatorRepo.findByEmail(email);
    if (existingCreatorByEmail&&existingCreatorByEmail.status!=="rejected") {
      throw new Error("EMAIL_EXISTS");
    }

    const existingUserByEmail = await this._userRepo.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error("USER_EMAIL_EXISTS");
    }

    const existingPhone = await this._creatorRepo.findByPhone(phone);
    if (existingPhone &&existingPhone.status!=="rejected") {
      throw new Error("PHONE_EXISTS");
    }
  }
}

