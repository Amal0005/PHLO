import { PackageEntity } from "@/domain/entities/packageEntity";

export interface IPackageRepository {
  add(data: PackageEntity): Promise<PackageEntity>;
}
