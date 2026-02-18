import { PackageEntity } from "@/domain/entities/packageEntity";
import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IGetPackageUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetPackagesUseCase implements IgetPackagesUseCase {
  constructor(
    private packageRepository: IPackageRepository
  ) { }
  async getPackage(creatorId: string, page: number, limit: number, search?: string, sortBy?: string): Promise<PaginatedResult<PackageEntity>> {
    return await this.packageRepository.findAllPackages({
      creatorId,
      page,
      limit,
      search,
      sortBy: sortBy as any
    });
  }
}
