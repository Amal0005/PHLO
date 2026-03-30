import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

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
      isSubscribed: !!(entity.subscription && entity.subscription.status === "active" && new Date(entity.subscription.endDate) > new Date()),
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
      subscription: entity.subscription ? {
        planId: entity.subscription.planId.toString(),
        planName: entity.subscription.planName,
        status: entity.subscription.status,
        startDate: entity.subscription.startDate,
        endDate: entity.subscription.endDate,
        stripeSessionId: entity.subscription.stripeSessionId,
      } : undefined,
      upcomingSubscription: entity.upcomingSubscription ? {
        planId: entity.upcomingSubscription.planId.toString(),
        planName: entity.upcomingSubscription.planName,
        status: entity.upcomingSubscription.status,
        startDate: entity.upcomingSubscription.startDate,
        endDate: entity.upcomingSubscription.endDate,
        stripeSessionId: entity.upcomingSubscription.stripeSessionId,
      } : undefined,
    };
  }
}
