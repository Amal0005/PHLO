import { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import { PackageMapper } from "@/application/mapper/user/packageMapper";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { IGetPackageDetailUseCase } from "@/domain/interface/user/packages/IGetPackageDetailUseCase ";

export class GetPackageDetailUseCase implements IGetPackageDetailUseCase {
  constructor(
    private packageRepository: IPackageRepository

  ){}

  async getPackageById(packageId: string): Promise<PackageResponseDto | null> {
    const pkg = await this.packageRepository.findById(packageId);
    return pkg ? PackageMapper.toDto(pkg) : null;
  }
}