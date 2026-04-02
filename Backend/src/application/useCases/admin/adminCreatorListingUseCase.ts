import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import type { IAdminCreatorListingUseCase } from "@/domain/interfaces/admin/IAdminCreatorListingUseCase";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

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

