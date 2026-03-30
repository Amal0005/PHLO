import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { PackageFilters } from "@/domain/interface/repository/IPackageRepository";

export interface IListUserPackagesUseCase {
  listPackages(filters?: PackageFilters): Promise<PaginatedResult<PackageResponseDto>>;
}
