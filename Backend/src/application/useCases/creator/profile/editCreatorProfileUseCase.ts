import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import { IeditCreatorProfileUseCase } from "@/domain/interface/creator/profile/IEditCreatorUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class EditCreatorProfileUseCase implements IeditCreatorProfileUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) {}
    async editProfile(creatorId: string, data: any): Promise<CreatorResponseDto | null> {
        if (!creatorId) throw new Error("Creator id is required")

        if (!data) throw new Error("data is not getting")
        if (data.phone) {
            const trimmed = data.phone.trim()
            const existingPhone = await this._creatorRepo.findByPhone(trimmed)
            if (existingPhone && (existingPhone as any)._id?.toString() !== creatorId) {
                throw new Error("Mobile number is already used")
            }
        }

        const updatedCreator = await this._creatorRepo.updateProfile(creatorId, data)
        return updatedCreator ? CreatorMapper.toDto(updatedCreator) : null;
    }
}
