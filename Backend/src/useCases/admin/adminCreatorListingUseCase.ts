import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IadminCreatorListingUseCase } from "@/domain/interface/admin/IadminCreatorListingUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class AdminCreatorListingUseCase implements IadminCreatorListingUseCase {
  constructor(private _creatorRepo: IcreatorRepository) {}
async getAllCreators(page: number, limit: number): Promise<PaginatedResult<CreatorEntity>> {
        return await this._creatorRepo.findAllCreators(page, limit);
}
}
