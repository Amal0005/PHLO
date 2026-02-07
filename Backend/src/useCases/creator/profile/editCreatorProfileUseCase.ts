import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IeditCreatorProfileUseCase } from "@/domain/interface/creator/profile/IeditCreatorUseCase";

export class EditCreatorProfileUseCase implements IeditCreatorProfileUseCase{
    constructor(
        private _creatorRepo:IcreatorRepository
    ){}
    async editProfile(creatorId: string, data: Partial<CreatorEntity>): Promise<CreatorEntity | null> {
        if(!creatorId)throw new Error("Creator id is required")
            return await this._creatorRepo.updateProfile(creatorId,data)
    }
}