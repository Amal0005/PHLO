import { User } from "@/domain/entities/userEntities";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { IEditUserProfileUseCase } from "@/domain/interface/user/profile/IEditUserProfileUseCase";

export class EditUserProfileUsecase implements IEditUserProfileUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
  ) {}
  async editProfile(
    userId: string,
    data: { name?: string; phone?: string; image?: string; email: string },
  ): Promise<User | null> {
    if (!userId) throw new Error("userID is required");
    if (!data) throw new Error("User dara is required");
    if (data.phone) {
      const trimmed = data.phone.trim();
      const existingPhone = await this._userRepo.findByPhone(trimmed);
      if (existingPhone && existingPhone._id !== userId) {
        throw new Error("This mobile number is already in use");
      }
      data.phone = trimmed;
    }
    if (data.email) {
      const trimmed = data.email.trim().toLowerCase();
      const existingEmail = await this._userRepo.findByEmail(trimmed);
      const existingCreator = await this._creatorRepo.findByEmail(trimmed);
      if (existingCreator) {
        throw new Error("The email is already have a creator");
      }
      if (existingEmail && existingEmail._id !== userId) {
        throw new Error("The email is already used");
      }
      data.email = trimmed;
    }
    const newUser = await this._userRepo.editProfile(userId, data);
    return newUser;
  }
}

