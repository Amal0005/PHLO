import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { ICreatorModel } from "@/framework/database/model/creatorModel";

export class CreatorMapper {
  static toDomain(doc: ICreatorModel): CreatorEntity {
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
      subscription: doc.subscription ? {
        planId: doc.subscription.planId.toString(),
        planName: doc.subscription.planName,
        status: doc.subscription.status,
        startDate: doc.subscription.startDate,
        endDate: doc.subscription.endDate,
        stripeSessionId: doc.subscription.stripeSessionId,
      } : undefined,
    };
  }
}
