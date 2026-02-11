import { PackageEntity } from "@/domain/entities/packageEntity";
export interface IgetPackagesUseCase {
  getPackage(creatorId: string): Promise<PackageEntity[]>;
}