import { UserResponseDto } from "@/domain/dto/user/userResponseDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IAdminUserListingUseCase {
  getAllUsers(
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<PaginatedResult<UserResponseDto>>;
}

