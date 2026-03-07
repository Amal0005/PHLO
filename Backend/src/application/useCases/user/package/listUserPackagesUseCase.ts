import { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { PackageMapper } from "@/application/mapper/user/packageMapper";
import { IPackageRepository, PackageFilters } from "@/domain/interface/repositories/IPackageRepository";
import { IListUserPackagesUseCase } from "@/domain/interface/user/packages/IListUserPackagesUseCase";
import { PaginatedResult } from "@/domain/types/paginationTypes";

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
