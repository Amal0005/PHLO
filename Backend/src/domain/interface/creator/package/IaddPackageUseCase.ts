import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IaddPackageUseCase {
  addPackage(data: Partial<PackageEntity>): Promise<PackageEntity>;
}
