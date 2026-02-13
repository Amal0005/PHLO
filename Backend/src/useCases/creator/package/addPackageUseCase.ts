import { PackageEntity } from "@/domain/entities/packageEntity";
import { IAddPackageUseCase } from "@/domain/interface/creator/package/IaddPackageUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";

export class AddPackageUseCase implements IAddPackageUseCase {
    constructor(
        private _packageRepo: IPackageRepository
    ) { }
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
