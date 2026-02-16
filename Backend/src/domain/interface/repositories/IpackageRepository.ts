import { PackageEntity } from "@/domain/entities/packageEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface PackageFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  creatorId?: string;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "newest";
  lat?: number;
  lng?: number;
  radiusInKm?: number;
}

export interface IPackageRepository extends IBaseRepository<PackageEntity> {
  add(data: PackageEntity): Promise<PackageEntity>;
  findByCreatorId(creatorId: string): Promise<PackageEntity[]>;
  findAllPackages(filters?: PackageFilters): Promise<PackageEntity[]>;
}
