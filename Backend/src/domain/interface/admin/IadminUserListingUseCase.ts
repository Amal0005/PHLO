import { User } from "../../entities/userEntities";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IAdminUserListingUseCase {
  getAllUsers(
    page: number,
    limit: number
  ): Promise<PaginatedResult<User>>;
}

