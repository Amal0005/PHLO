import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IPackageRepository {
  add(data: PackageEntity): Promise<PackageEntity>;
  findByCreatorId(creatorId: string): Promise<PackageEntity[]>;
  findById(packageId: string): Promise<PackageEntity | null>;
  update(packageId: string, data: Partial<PackageEntity>): Promise<PackageEntity | null>;
  delete(packageId: string): Promise<boolean>;
    findAllPackages(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    creatorId?: string;
  }): Promise<PackageEntity[]>;
}

