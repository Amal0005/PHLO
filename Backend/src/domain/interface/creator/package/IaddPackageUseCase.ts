import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IAddPackageUseCase {
  addPackage(data: Partial<PackageEntity>): Promise<PackageEntity>;
  
}

