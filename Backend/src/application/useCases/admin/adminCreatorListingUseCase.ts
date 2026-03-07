import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import { IAdminCreatorListingUseCase } from "@/domain/interface/admin/IAdminCreatorListingUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class AdminCreatorListingUseCase implements IAdminCreatorListingUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository
  ) {}
  async getAllCreators(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<CreatorResponseDto>> {
    const result = await this._creatorRepo.findAllCreators(page, limit, search, status);
    return {
      ...result,
      data: result.data.map(creator => CreatorMapper.toDto(creator))
    };
  }
}

