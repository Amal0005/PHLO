import { PackageEntity } from "@/domain/entities/packageEntity";
import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IgetPackageUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";

export class GetPackagesUseCase implements IgetPackagesUseCase {
  constructor(
    private packageRepository: IPackageRepository
  ) { }
  async getPackage(creatorId: string): Promise<PackageEntity[]> {
    return await this.packageRepository.findByCreatorId(creatorId);
  }
}

