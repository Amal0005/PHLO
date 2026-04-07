import type { PackageEntity } from "@/domain/entities/packageEntity";
import type {
  IPackageRepository,
  PackageFilters
} from "@/domain/interfaces/repository/IPackageRepository";
import type {
  IPackageModel
} from "@/framework/database/model/packageModel";
import {
  PackageModel
} from "@/framework/database/model/packageModel";
import { BaseRepository } from "@/adapters/repository/baseRepository";
import type { SortOrder, Document, PipelineStage } from "mongoose";
import { Types } from "mongoose";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export class PackageRepository
  extends BaseRepository<PackageEntity, IPackageModel>
  implements IPackageRepository {
  constructor() {
    super(PackageModel);
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
      const pipeline: PipelineStage[] = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [filters.lng, filters.lat]
            },
            distanceField: "distance",
            spherical: true,
            key: "locations.coordinates",
            ...(filters.radiusInKm ? { maxDistance: filters.radiusInKm * 1000 } : {})
          }
        }
      ];


      const matchConditions: Record<string, unknown> = {};

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
          locations: 1,
          createdAt: 1,
          updatedAt: 1,
          distance: 1
        }
      });

      // Handle Sorting in Aggregation
      if (filters?.sortBy && filters.sortBy !== "distance") {
        const mappedSort = this.getSortOption(filters.sortBy);
        if (Object.keys(mappedSort).length > 0) {
          pipeline.push({ $sort: mappedSort });
        }
      }

      const countPipeline = [...pipeline, { $count: "total" }];
      const countResult = await this.model.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;

      pipeline.push({ $skip: skip }, { $limit: limit });

      const packages = await this.model.aggregate(pipeline);

      return {
        data: packages.map((pkg) => this.mapToEntity(pkg)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }


    const query: Record<string, unknown> = {};

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
    if (filters?.sortBy) {
      const mappedSort = this.getSortOption(filters.sortBy);
      if (Object.keys(mappedSort).length > 0) sortOption = mappedSort;
    }

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

  private getSortOption(sortBy: string): Record<string, SortOrder> {
    switch (sortBy) {
      case "price-asc": return { price: 1 };
      case "price-desc": return { price: -1 };
      case "newest": return { createdAt: -1 };
      case "oldest": return { createdAt: 1 };
      default: return {};
    }
  }

  protected mapToEntity(doc: IPackageModel | Record<string, unknown>): PackageEntity {
    // Check if doc is a Mongoose document
    if ("toObject" in doc && typeof doc.toObject === "function") {
      const obj = (doc as IPackageModel).toObject();
      return {
        _id: obj._id.toString(),
        creatorId: obj.creatorId,
        category: obj.category,
        title: obj.title,
        description: obj.description,
        price: obj.price,
        images: obj.images,
        locations: obj.locations,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      };
    }

    // Handle plain objects from aggregation
    const obj = doc as Record<string, unknown>;
    return {
      _id: obj._id?.toString() || "",
      creatorId: typeof obj.creatorId === "object" ? (obj.creatorId as { _id: string })._id.toString() : (obj.creatorId as string),
      category: typeof obj.category === "object" ? (obj.category as { _id: string })._id.toString() : (obj.category as string),
      title: obj.title as string,
      description: obj.description as string,
      price: obj.price as number,
      images: obj.images as string[],
      locations: obj.locations as PackageEntity["locations"],
      distance: obj.distance as number | undefined,
      createdAt: obj.createdAt as Date,
      updatedAt: obj.updatedAt as Date,
    };
  }
}

