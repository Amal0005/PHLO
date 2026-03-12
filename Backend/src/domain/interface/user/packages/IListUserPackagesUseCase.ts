import { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { PackageFilters } from "@/domain/interface/repository/IPackageRepository";

export interface IListUserPackagesUseCase {
  listPackages(filters?: PackageFilters): Promise<PaginatedResult<PackageResponseDto>>;
}
