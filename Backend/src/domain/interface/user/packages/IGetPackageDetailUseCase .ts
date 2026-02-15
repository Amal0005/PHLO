import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IGetPackageDetailUseCase {
  getPackageById(packageId: string): Promise<PackageEntity | null>;
}