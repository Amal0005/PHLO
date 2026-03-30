import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { PackageMapper } from "@/application/mapper/user/packageMapper";
import type { IPackageRepository, PackageFilters } from "@/domain/interface/repository/IPackageRepository";
import type { IListUserPackagesUseCase } from "@/domain/interface/user/packages/IListUserPackagesUseCase";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export class ListUserPackagesUseCase implements IListUserPackagesUseCase {
  constructor(
    private packageRepository: IPackageRepository

  ) {}

  async listPackages(filters?: PackageFilters): Promise<PaginatedResult<PackageResponseDto>> {
    const result = await this.packageRepository.findAllPackages(filters);
    return {
      ...result,
      data: result.data.map(pkg => PackageMapper.toDto(pkg))
    };
  }
}
