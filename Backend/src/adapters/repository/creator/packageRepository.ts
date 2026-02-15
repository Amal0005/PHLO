import { PackageEntity } from "@/domain/entities/packageEntity";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { PackageModel, IPackageModel } from "@/framework/database/model/packageModel";
import { BaseRepository } from "../BaseRepository";

export class PackageRepository extends BaseRepository<PackageEntity, IPackageModel> implements IPackageRepository {
  constructor() {
    super(PackageModel);
  }

  protected mapToEntity(pkg: any): PackageEntity {
    const obj = pkg.toObject();
    return { ...obj, _id: obj._id.toString() } as PackageEntity;
  }

  // Inherited: create, findAll, update, delete (automatically available!)

  // Override findById to include population logic
  async findById(packageId: string): Promise<PackageEntity | null> {
    const pkg = await this.model.findById(packageId)
      .populate('creatorId', 'fullName profilePhoto city')
      .populate('category', 'name');
    return pkg ? this.mapToEntity(pkg) : null;
  }

  async add(data: PackageEntity): Promise<PackageEntity> {
    const newPackage = await this.model.create(data as any);
    return this.mapToEntity(newPackage);
  }

  async findByCreatorId(creatorId: string): Promise<PackageEntity[]> {
    const packages = await this.model.find({ creatorId }).sort({ createdAt: -1 });
    return packages.map((pkg) => this.mapToEntity(pkg));
  }

  async findAllPackages(filters?: any): Promise<PackageEntity[]> {
    const query: any = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.creatorId) query.creatorId = filters.creatorId;
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    if (filters?.search && filters.search.trim()) {
      query.$or = [{ title: { $regex: filters.search, $options: 'i' } }, { description: { $regex: filters.search, $options: 'i' } }];
    }
    if (filters?.lat !== undefined && filters?.lng !== undefined) {
      query.location = { $near: { $geometry: { type: "Point", coordinates: [filters.lng, filters.lat] } } };
    }

    let sortOption: any = { createdAt: -1 };
    if (filters?.sortBy === "price-asc") sortOption = { price: 1 };
    else if (filters?.sortBy === "price-desc") sortOption = { price: -1 };

    const packages = await this.model.find(query)
      .populate('creatorId', 'fullName profilePhoto city')
      .populate('category', 'name')
      .sort(filters?.lat !== undefined ? {} : sortOption);

    return packages.map(pkg => this.mapToEntity(pkg));
  }
}
