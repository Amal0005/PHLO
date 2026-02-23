import { PackageEntity } from "@/domain/entities/packageEntity";
import { IAddPackageUseCase } from "@/domain/interface/creator/package/IAddPackageUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";

export class AddPackageUseCase implements IAddPackageUseCase {
  constructor(
    private _packageRepo: IPackageRepository,
    private _creatorRepo: ICreatorRepository,
  ) {}
  async addPackage(data: Partial<PackageEntity>): Promise<PackageEntity> {
    if (
      !data.title ||
      !data.description ||
      !data.price ||
      !data.category ||
      !data.location
    ) {
      throw new Error("Missing required fields");
    }
    const creator = await this._creatorRepo.findById(data.creatorId as string);
    if (
      !creator ||
      !creator.subscription?.planId ||
      creator.subscription.endDate < new Date()
    ) {
      throw new Error("Active subscription required to add packages.");
    }
    const newPackage: PackageEntity = {
      creatorId: data.creatorId!,
      title: data.title!,
      description: data.description!,
      price: data.price!,
      category: data.category!,
      images: data.images || [],
      location: data.location!,
      placeName: data.placeName,
    };

    return await this._packageRepo.add(newPackage);
  }
}
