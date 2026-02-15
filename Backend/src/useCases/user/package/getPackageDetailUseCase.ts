import { PackageEntity } from "@/domain/entities/packageEntity";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { IGetPackageDetailUseCase } from "@/domain/interface/user/packages/IGetPackageDetailUseCase ";

export class GetPackageDetailUseCase implements IGetPackageDetailUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async getPackageById(packageId: string): Promise<PackageEntity | null> {
    return await this.packageRepository.findById(packageId);
  }
}