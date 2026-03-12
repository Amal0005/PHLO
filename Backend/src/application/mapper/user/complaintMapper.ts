import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { User } from "@/domain/entities/userEntities";
import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export class ComplaintMapper {
  static toEntity(data: any): ComplaintEntity {
    return {
      _id: data._id?.toString(),
      userId: data.userId?.toString() || data.userId,
      creatorId: data.creatorId?.toString() || data.creatorId,
      bookingId: data.bookingId?.toString() || data.bookingId,
      reason: data.reason,
      description: data.description,
      status: data.status,
      adminComment: data.adminComment,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toEntityList(data: any[]): ComplaintEntity[] {
    return data.map((item) => this.toEntity(item));
  }

  static toDto(entity: ComplaintEntity): ComplaintResponseDTO {
    const user = entity.userId as unknown as User;
    const creator = entity.creatorId as unknown as CreatorEntity;

    return {
      id: entity._id!.toString(),
      userId: typeof user === "object" ? user._id!.toString() : entity.userId.toString(),
      userName: typeof user === "object" ? user.name : "Unknown",
      creatorId: typeof creator === "object" ? creator._id!.toString() : entity.creatorId.toString(),
      creatorName: typeof creator === "object" ? creator.fullName : "Unknown",
      bookingId: entity.bookingId,
      reason: entity.reason,
      description: entity.description,
      status: entity.status,
      adminComment: entity.adminComment,
      createdAt: entity.createdAt!,
    };
  }
}
