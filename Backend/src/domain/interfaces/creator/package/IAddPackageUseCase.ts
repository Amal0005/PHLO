import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { PackageEntity } from "@/domain/entities/packageEntity";

export interface IAddPackageUseCase {
  addPackage(data: Partial<PackageEntity>): Promise<PackageResponseDto>;
}


