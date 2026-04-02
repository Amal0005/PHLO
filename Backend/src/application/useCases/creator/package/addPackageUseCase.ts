import { PackageMapper } from "@/application/mapper/user/packageMapper";
import type { PackageRequestDto } from "@/domain/dto/package/packageRequestDto";
import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";
import type { PackageEntity } from "@/domain/entities/packageEntity";
import type { IAddPackageUseCase } from "@/domain/interfaces/creator/package/IAddPackageUseCase";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { IPackageRepository } from "@/domain/interfaces/repository/IPackageRepository";

export class AddPackageUseCase implements IAddPackageUseCase {
  constructor(
    private _packageRepo: IPackageRepository,
    private _creatorRepo: ICreatorRepository,
  ) {}
  async addPackage(data: Partial<PackageRequestDto>): Promise<PackageResponseDto> {
    if (
      !data.title ||
      !data.description ||
      !data.price ||
      !data.category ||
      !data.locations ||
      data.locations.length === 0
    ) {
      throw new Error("Missing required fields");
    }
    const creator = await this._creatorRepo.findById(data.creatorId as string);
    if (
      !creator ||
      !creator.subscription?.planId ||
      !creator.subscription?.endDate ||
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
      locations: data.locations!,
    };

    const addedPackage = await this._packageRepo.add(newPackage);
    return PackageMapper.toDto(addedPackage);
  }
}
