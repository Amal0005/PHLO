import { PackageEntity } from "@/domain/entities/packageEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IPackageRepository extends IBaseRepository<PackageEntity> {
  add(data: PackageEntity): Promise<PackageEntity>;
  findByCreatorId(creatorId: string): Promise<PackageEntity[]>;
  findAllPackages(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    creatorId?: string;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "newest";
    lat?: number;
    lng?: number;
    radiusInKm?: number;
  }): Promise<PackageEntity[]>;
}
