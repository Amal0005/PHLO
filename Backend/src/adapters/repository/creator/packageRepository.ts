import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { PackageEntity } from "@/domain/entities/packageEntity";
import { PackageModel } from "@/framework/database/model/packageModel";

export class PackageRepository implements IPackageRepository {
  async add(data: PackageEntity): Promise<PackageEntity> {
    const newPackage = await PackageModel.create(data);
    const obj = newPackage.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
    };
  }
    async findByCreatorId(creatorId: string): Promise<PackageEntity[]> {
    const packages = await PackageModel.find({ creatorId }).sort({ createdAt: -1 });
    return packages.map(pkg => {
      const obj = pkg.toObject();
      return {
        ...obj,
        _id: obj._id.toString(),
      } as PackageEntity;
    });
  }
}

