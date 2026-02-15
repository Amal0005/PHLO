import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IListUserPackagesUseCase {
  listPackages(filters?: PackageFilters): Promise<PackageEntity[]>;
}

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
