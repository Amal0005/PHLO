import { PackageEntity } from "@/domain/entities/packageEntity";
import { IaddPackageUseCase } from "@/domain/interface/creator/package/IaddPackageUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IpackageRepository";

export class AddPackageUseCase implements IaddPackageUseCase{
    constructor(
        private _packageRepo:IPackageRepository
    ){}
    async addPackage(data: Partial<PackageEntity>): Promise<PackageEntity> {
        const newPackage: PackageEntity = {
      creatorId: data.creatorId!,
      title: data.title!,
      description: data.description!,
      price: data.price!,
      category: data.category!,
      status: "pending",
      images: data.images || [],
    };
    return await this._packageRepo.add(newPackage)
    }
}