import { IDeletePackageUseCase } from "@/domain/interface/creator/package/IDeletePackageUseCase";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";

export class DeletePackageUseCase implements IDeletePackageUseCase {
  constructor(private _packageRepo: IPackageRepository) {}

  async deletePackage(packageId: string, creatorId: string): Promise<void> {
    const existingPackage = await this._packageRepo.findById(packageId);
    
    if (!existingPackage) {
      throw new Error("Package not found");
    }

    if (existingPackage.creatorId.toString() !== creatorId.toString()) {
      throw new Error("Unauthorized: You can only delete your own packages");
    }

    const deleted = await this._packageRepo.delete(packageId);
    
    if (!deleted) {
      throw new Error("Failed to delete package");
    }
  }
}
