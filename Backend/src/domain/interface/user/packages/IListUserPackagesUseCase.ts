import { PackageEntity } from "@/domain/entities/packageEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IListUserPackagesUseCase {
  listPackages(filters?: PackageFilters): Promise<PaginatedResult<PackageEntity>>;
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
  page?: number;
  limit?: number;
}
