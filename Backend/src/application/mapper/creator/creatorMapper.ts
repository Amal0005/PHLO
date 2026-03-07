import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export class CreatorMapper {
  static toDto(entity: CreatorEntity): CreatorResponseDto {
    return {
      _id: entity._id?.toString() || "",
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      profilePhoto: entity.profilePhoto,
      city: entity.city,
      yearsOfExperience: entity.yearsOfExperience,
      bio: entity.bio,
      portfolioLink: entity.portfolioLink,
      governmentId: entity.governmentId,
      status: entity.status,
      rejectionReason: entity.rejectionReason,
      specialties: entity.specialties || [],
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
      subscription: entity.subscription ? {
        planId: entity.subscription.planId.toString(),
        planName: entity.subscription.planName,
        status: entity.subscription.status,
        startDate: entity.subscription.startDate,
        endDate: entity.subscription.endDate,
        stripeSessionId: entity.subscription.stripeSessionId,
      } : undefined,
    };
  }
}
