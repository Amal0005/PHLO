import { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { PackageFilters } from "@/domain/interface/repositories/IPackageRepository";

export interface IListUserPackagesUseCase {
  listPackages(filters?: PackageFilters): Promise<PaginatedResult<PackageResponseDto>>;
}
