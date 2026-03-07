import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export interface IAdminCreatorListingUseCase {
  getAllCreators(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<CreatorResponseDto>>;
}
