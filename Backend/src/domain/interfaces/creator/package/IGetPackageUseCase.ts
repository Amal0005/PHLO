import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IgetPackagesUseCase {
  getPackage(creatorId: string, page: number, limit: number, search?: string, sortBy?: string): Promise<PaginatedResult<PackageResponseDto>>;
}