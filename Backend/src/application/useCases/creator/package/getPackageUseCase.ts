import { PackageMapper } from "@/application/mapper/user/packageMapper";
import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { IgetPackagesUseCase } from "@/domain/interfaces/creator/package/IGetPackageUseCase";
import type { IPackageRepository } from "@/domain/interfaces/repository/IPackageRepository";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

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
