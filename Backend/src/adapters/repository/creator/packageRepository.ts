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
  
  async findById(packageId: string): Promise<PackageEntity | null> {
    const pkg = await PackageModel.findById(packageId);
    if (!pkg) return null;
    const obj = pkg.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
    } as PackageEntity;
  }
  async update(packageId: string, data: Partial<PackageEntity>): Promise<PackageEntity | null> {
    const updatedPackage = await PackageModel.findByIdAndUpdate(
      packageId,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!updatedPackage) return null;
    const obj = updatedPackage.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
    } as PackageEntity;
  }
    async delete(packageId: string): Promise<boolean> {
    const result = await PackageModel.findByIdAndDelete(packageId);
    return result !== null;
  }
}

