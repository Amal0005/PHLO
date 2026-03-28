import { PackageMapper } from "@/application/mapper/user/packageMapper";
import { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IGetPackageUseCase";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetPackagesUseCase implements IgetPackagesUseCase {
  constructor(
    private packageRepository: IPackageRepository
  ) {}
  async getPackage(creatorId: string, page: number, limit: number, search?: string, sortBy?: string): Promise<PaginatedResult<PackageResponseDto>> {
    const result = await this.packageRepository.findAllPackages({
      creatorId,
      page,
      limit,
      search,
      sortBy: sortBy as "price-asc" | "price-desc" | "newest" | "oldest" | undefined
    });
    return {
      ...result,
      data: result.data.map(pkg => PackageMapper.toDto(pkg))
    };
  }
}
