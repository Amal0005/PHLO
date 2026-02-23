import { PackageEntity } from "@/domain/entities/packageEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IgetPackagesUseCase {
  getPackage(creatorId: string, page: number, limit: number, search?: string, sortBy?: string): Promise<PaginatedResult<PackageEntity>>;
}