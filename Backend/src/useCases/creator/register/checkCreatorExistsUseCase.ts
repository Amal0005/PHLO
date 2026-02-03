import { IcheckCreatorExistsUseCase } from "@/domain/interface/creator/register/IcheckCreatorExistsUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";

export class CheckCreatorExistsUseCase implements IcheckCreatorExistsUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private _userRepo: IuserRepository
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
