import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { IeditCreatorProfileUseCase } from "@/domain/interface/creator/profile/IEditCreatorUseCase";

export class EditCreatorProfileUseCase implements IeditCreatorProfileUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) { }
    async editProfile(creatorId: string, data: Partial<CreatorEntity>): Promise<CreatorEntity | null> {
        if (!creatorId) throw new Error("Creator id is required")

        if (!data) throw new Error("data is not getting")
        if (data.phone) {
            const trimmed = data.phone.trim()
            const existingPhone = await this._creatorRepo.findByPhone(trimmed)
            if (existingPhone && existingPhone._id !== creatorId) {
                throw new Error("Mobile number is already used")
            }
        }

        return await this._creatorRepo.updateProfile(creatorId, data)
    }
}
