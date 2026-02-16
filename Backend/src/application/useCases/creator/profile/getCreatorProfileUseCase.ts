import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IGetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IGetCreatorProfileUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class GetCreatorProfileUseCase implements IGetCreatorProfileUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) {}
    async getProfile(creatorId: string): Promise<CreatorEntity | null> {
        return await this._creatorRepo.findById(creatorId)
    }
}
