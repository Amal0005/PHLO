import { PackageEntity } from "@/domain/entities/packageEntity";
import { IEditPackageUseCase } from "@/domain/interface/creator/package/IEditPackageUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";

export class EditPackageUseCase implements IEditPackageUseCase {
  constructor(private _packageRepo: IPackageRepository) {}

  async editPackage(
    packageId: string,
    creatorId: string,
    data: Partial<PackageEntity>
  ): Promise<PackageEntity> {
    const existingPackage = await this._packageRepo.findById(packageId);
    
    if (!existingPackage) {
      throw new Error("Package not found");
    }

    if (existingPackage.creatorId.toString() !== creatorId.toString()) {
      throw new Error("Unauthorized: You can only edit your own packages");
    }

    const updateData: Partial<PackageEntity> = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.category && { category: data.category }),
      ...(data.images && { images: data.images }),
    };

    const updatedPackage = await this._packageRepo.update(packageId, updateData);
    
    if (!updatedPackage) {
      throw new Error("Failed to update package");
    }

    return updatedPackage;
  }
}