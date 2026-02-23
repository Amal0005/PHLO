import { PackageEntity } from "@/domain/entities/packageEntity";
import { IPackageModel } from "@/framework/database/model/packageModel";

export class PackageMapper {
  static toEntity(doc: IPackageModel): PackageEntity {
    const obj = doc.toObject();

    return {
      _id: obj._id.toString(),
      creatorId: obj.creatorId,
      category: obj.category,
      title: obj.title,
      description: obj.description,
      price: obj.price,
      images: obj.images,
      location: obj.location,
      placeName: obj.placeName,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
