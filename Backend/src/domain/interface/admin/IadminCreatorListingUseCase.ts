import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CreatorEntity } from "../../entities/creatorEntities";

export interface IAdminCreatorListingUseCase {
  getAllCreators(page: number,limit: number): Promise<PaginatedResult<CreatorEntity>>;
}
