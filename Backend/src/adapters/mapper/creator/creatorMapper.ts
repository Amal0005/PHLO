import { CreatorEntity } from "@/domain/entities/creatorEntities";

export class CreatorMapper {
  static toDomain(doc: any): CreatorEntity {
    return {
      _id: doc._id?.toString(),
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password ?? "",
      phone: doc.phone,
      profilePhoto: doc.profilePhoto,
      city: doc.city,
      yearsOfExperience: doc.yearsOfExperience,
      bio: doc.bio,
      portfolioLink: doc.portfolioLink,
      governmentId: doc.governmentId,
      status: doc.status,
      rejectionReason: doc.rejectionReason,
      specialties: doc.specialties,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
