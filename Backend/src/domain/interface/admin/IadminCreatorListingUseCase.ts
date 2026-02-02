import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CreatorEntity } from "../../entities/creatorEntities";

export interface IadminCreatorListingUseCase {
  getAllCreators(page: number,limit: number): Promise<PaginatedResult<CreatorEntity>>;
}