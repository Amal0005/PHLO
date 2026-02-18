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
import { SortOrder, Document, Types } from "mongoose";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class PackageRepository
  extends BaseRepository<PackageEntity, IPackageModel>
  implements IPackageRepository {
  constructor() {
    super(PackageModel);
  }

  protected mapToEntity(pkg: IPackageModel): PackageEntity {
    const obj = pkg.toObject();
    const { _id, ...rest } = obj;
    return { ...rest, _id: _id.toString() } as PackageEntity;
  }


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

  async findAllPackages(filters?: PackageFilters): Promise<PaginatedResult<PackageEntity>> {
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.max(1, filters?.limit || 10);
    const skip = (page - 1) * limit;


    if (filters?.lat !== undefined && filters?.lng !== undefined) {
      const pipeline: any[] = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [filters.lng, filters.lat]
            },
            distanceField: "distance",
            spherical: true,
            ...(filters.radiusInKm ? { maxDistance: filters.radiusInKm * 1000 } : {})
          }
        }
      ];


      const matchConditions: any = {};

      if (filters?.category) matchConditions.category = new Types.ObjectId(filters.category);
      if (filters?.creatorId) matchConditions.creatorId = new Types.ObjectId(filters.creatorId);

      if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
        const priceFilter: Record<string, number> = {};
        if (filters.minPrice !== undefined) priceFilter.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) priceFilter.$lte = filters.maxPrice;
        matchConditions.price = priceFilter;
      }

      if (filters?.search?.trim()) {
        const searchRegex = { $regex: filters.search, $options: "i" };
        matchConditions.$or = [
          { title: searchRegex },
          { description: searchRegex }
        ];
      }

      if (Object.keys(matchConditions).length > 0) {
        pipeline.push({ $match: matchConditions });
      }


      pipeline.push(
        {
          $lookup: {
            from: "creators",
            localField: "creatorId",
            foreignField: "_id",
            as: "creatorId"
          }
        },
        { $unwind: { path: "$creatorId", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }
      );


      pipeline.push({
        $project: {
          creatorId: {
            _id: "$creatorId._id",
            fullName: "$creatorId.fullName",
            profilePhoto: "$creatorId.profilePhoto",
            city: "$creatorId.city"
          },
          category: {
            _id: "$category._id",
            name: "$category.name"
          },
          title: 1,
          description: 1,
          price: 1,
          images: 1,
          location: 1,
          placeName: 1,
          createdAt: 1,
          updatedAt: 1,
          distance: 1
        }
      });


      const countPipeline = [...pipeline, { $count: "total" }];
      const countResult = await this.model.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;


      pipeline.push({ $skip: skip }, { $limit: limit });

      const packages = await this.model.aggregate(pipeline);

      return {
        data: packages.map((pkg) => {
          const { _id, ...rest } = pkg;
          return { ...rest, _id: _id.toString() } as PackageEntity;
        }),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }


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

    let sortOption: Record<string, SortOrder> = { createdAt: -1 };

    if (filters?.sortBy === "price-asc") sortOption = { price: 1 };
    else if (filters?.sortBy === "price-desc") sortOption = { price: -1 };
    else if (filters?.sortBy === "oldest") sortOption = { createdAt: 1 };

    const [packages, total] = await Promise.all([
      this.model
        .find(query)
        .populate("creatorId", "fullName profilePhoto city")
        .populate("category", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query)
    ]);

    return {
      data: packages.map((pkg) => this.mapToEntity(pkg)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

