import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export interface IAdminCreatorListingUseCase {
  getAllCreators(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<CreatorResponseDto>>;
}
