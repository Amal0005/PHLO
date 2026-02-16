import { PackageEntity } from "@/domain/entities/packageEntity";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { IListUserPackagesUseCase, PackageFilters } from "@/domain/interface/user/packages/IListUserPackagesUseCase";

export class ListUserPackagesUseCase implements IListUserPackagesUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async listPackages(filters?: PackageFilters): Promise<PackageEntity[]> {
    return await this.packageRepository.findAllPackages(filters);
  }
}
