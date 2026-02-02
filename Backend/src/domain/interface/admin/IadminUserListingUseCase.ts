import { User } from "../../entities/userEntities";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IadminUserListingUseCase {
  getAllUsers(
    page: number,
    limit: number
  ): Promise<PaginatedResult<User>>;
}
