import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CreatorEntity } from "../../entities/creatorEntities";

export interface IAdminCreatorListingUseCase {
  getAllCreators(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<CreatorEntity>>;
}
