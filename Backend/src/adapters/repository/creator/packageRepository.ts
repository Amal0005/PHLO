import { PackageEntity } from "@/domain/entities/packageEntity";
import {
  IPackageRepository,
  PackageFilters
} from "@/domain/interface/repositories/IPackageRepository";
import {
  PackageModel,
  IPackageModel
} from "@/framework/database/model/packageModel";
import { BaseRepository } from "../baseRepository";
import { SortOrder, Document } from "mongoose";

export class PackageRepository
  extends BaseRepository<PackageEntity, IPackageModel>
  implements IPackageRepository
{
  constructor() {
    super(PackageModel);
  }

  protected mapToEntity(pkg: IPackageModel): PackageEntity {
    const obj = pkg.toObject();
    const { _id, ...rest } = obj;
    return { ...rest, _id: _id.toString() } as PackageEntity;
  }

  // Override findById with population
  async findById(packageId: string): Promise<PackageEntity | null> {
    const pkg = await this.model
      .findById(packageId)
      .populate("creatorId", "fullName profilePhoto city")
      .populate("category", "name")
      .exec();

    return pkg ? this.mapToEntity(pkg) : null;
  }

  async add(data: Partial<PackageEntity>): Promise<PackageEntity> {
    const newPackage = await this.model.create(
      data as unknown as Omit<IPackageModel, keyof Document>
    );

    return this.mapToEntity(newPackage as IPackageModel);
  }

  async findByCreatorId(creatorId: string): Promise<PackageEntity[]> {
    const packages = await this.model
      .find({ creatorId })
      .sort({ createdAt: -1 })
      .exec();

    return packages.map((pkg) => this.mapToEntity(pkg));
  }

  async findAllPackages(filters?: PackageFilters): Promise<PackageEntity[]> {
    const query: Record<string, any> = {};

    if (filters?.category) query.category = filters.category;
    if (filters?.creatorId) query.creatorId = filters.creatorId;

    if (
      filters?.minPrice !== undefined ||
      filters?.maxPrice !== undefined
    ) {
      const priceFilter: Record<string, number> = {};

      if (filters.minPrice !== undefined)
        priceFilter.$gte = filters.minPrice;

      if (filters.maxPrice !== undefined)
        priceFilter.$lte = filters.maxPrice;

      query.price = priceFilter;
    }

    if (filters?.search?.trim()) {
      const searchRegex = { $regex: filters.search, $options: "i" };

      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Geo Search
    if (filters?.lat !== undefined && filters?.lng !== undefined) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [filters.lng, filters.lat]
          }
        }
      };
    }

    let sortOption: Record<string, SortOrder> = { createdAt: -1 };

    if (filters?.sortBy === "price-asc") sortOption = { price: 1 };
    else if (filters?.sortBy === "price-desc") sortOption = { price: -1 };

    const packages = await this.model
      .find(query)
      .populate("creatorId", "fullName profilePhoto city")
      .populate("category", "name")
      .sort(filters?.lat !== undefined ? {} : sortOption)
      .exec();

    return packages.map((pkg) => this.mapToEntity(pkg));
  }
}
