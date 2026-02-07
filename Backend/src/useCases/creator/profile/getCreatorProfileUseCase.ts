import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IgetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IgetCreatorProfileUseCase";

export class GetCreatorProfileUseCase implements IgetCreatorProfileUseCase{
    constructor(
        private _creatorRepo:IcreatorRepository
    ){}
    async getProfile(creatorId: string): Promise<CreatorEntity | null> {
        return await this._creatorRepo.findById(creatorId)
    }
}