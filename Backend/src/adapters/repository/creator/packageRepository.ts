import { PackageEntity } from "@/domain/entities/packageEntity";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
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
    const packages = await PackageModel.find({ creatorId }).sort({
      createdAt: -1,
    });
    return packages.map((pkg) => {
      const obj = pkg.toObject();
      return {
        ...obj,
        _id: obj._id.toString(),
      } as PackageEntity;
    });
  }

  async findById(packageId: string): Promise<PackageEntity | null> {
    const pkg = await PackageModel.findById(packageId)
      .populate('creatorId', 'fullName profilePhoto city')
      .populate('category', 'name');

    if (!pkg) return null;
    const obj = pkg.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
    } as PackageEntity;
  }

  async update(
    packageId: string,
    data: Partial<PackageEntity>,
  ): Promise<PackageEntity | null> {
    const updatedPackage = await PackageModel.findByIdAndUpdate(
      packageId,
      { $set: data },
      { new: true, runValidators: true },
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

  async findAllPackages(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    creatorId?: string;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "newest";
    lat?: number;
    lng?: number;
    radiusInKm?: number;
  }): Promise<PackageEntity[]> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.creatorId) {
      query.creatorId = filters.creatorId;
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    if (filters?.search && filters.search.trim()) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Proximity search logic
    if (filters?.lat !== undefined && filters?.lng !== undefined) {
      console.log("adding location")
      const radiusInMeters = (filters.radiusInKm || 50) * 1000;
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [filters.lng, filters.lat],
          },
          // $maxDistance: radiusInMeters,
        },
      };
    }

    let sortOption: any = { createdAt: -1 };
    if (filters?.sortBy === "price-asc") {
      sortOption = { price: 1 };
    } else if (filters?.sortBy === "price-desc") {
      sortOption = { price: -1 };
    }
    console.log("filter", query)
    const packages = await PackageModel.find(query)
      .populate('creatorId', 'fullName profilePhoto city')
      .populate('category', 'name')
      .sort(filters?.lat !== undefined ? {} : sortOption)

    return packages.map(pkg => {
      const obj = pkg.toObject();
      return {
        ...obj,
        _id: obj._id.toString(),
      } as PackageEntity;
    });
  }
}
