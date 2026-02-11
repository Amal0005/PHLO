import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { IGetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IGetCreatorProfileUseCase";

export class GetCreatorProfileUseCase implements IGetCreatorProfileUseCase{
    constructor(
        private _creatorRepo:ICreatorRepository
    ){}
    async getProfile(creatorId: string): Promise<CreatorEntity | null> {
        return await this._creatorRepo.findById(creatorId)
    }
}
