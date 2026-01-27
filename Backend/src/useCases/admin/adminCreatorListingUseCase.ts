import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IadminCreatorListingUseCase } from "@/domain/interface/admin/IadminCreatorListingUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";

export class AdminCreatorListingUseCase implements IadminCreatorListingUseCase{
    constructor(
        private _creatorRepo:IcreatorRepository
    ){}
    async getAllCreators(): Promise<CreatorEntity[]> {
        const creators=await this._creatorRepo.findAllCreators()
        console.log(creators)
        return creators

    }
}