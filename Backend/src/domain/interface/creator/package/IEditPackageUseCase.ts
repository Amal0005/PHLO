import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { PackageEntity } from "@/domain/entities/packageEntity";

export interface IEditPackageUseCase {
  editPackage(packageId: string, creatorId: string, data: Partial<PackageEntity>): Promise<PackageResponseDto>;
}
