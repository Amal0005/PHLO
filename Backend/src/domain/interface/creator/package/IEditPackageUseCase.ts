import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IEditPackageUseCase {
  editPackage(packageId: string, creatorId: string, data: Partial<PackageEntity>): Promise<PackageEntity>;
}
