import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IAdminCreatorListingUseCase } from "@/domain/interface/admin/IAdminCreatorListingUseCase";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class AdminCreatorListingUseCase implements IAdminCreatorListingUseCase {
  constructor(private _creatorRepo: ICreatorRepository) {}
async getAllCreators(page: number, limit: number): Promise<PaginatedResult<CreatorEntity>> {
        return await this._creatorRepo.findAllCreators(page, limit);
}
}

