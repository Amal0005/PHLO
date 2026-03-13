import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { User } from "@/domain/entities/userEntities";
import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export class ComplaintMapper {
  static toEntity(data: any): ComplaintEntity {
    return {
      _id: data._id ? String(data._id) : undefined,
      userId: data.userId as string | User,
      creatorId: data.creatorId as string | CreatorEntity,
      bookingId: data.bookingId ? String(data.bookingId) : "",
      reason: String(data.reason || ""),
      description: String(data.description || ""),
      status: data.status as "pending" | "resolved" | "dismissed",
      adminComment: data.adminComment ? String(data.adminComment) : undefined,
      createdAt: data.createdAt as Date,
      updatedAt: data.updatedAt as Date,
    };
  }

  static toEntityList(data: any[]): ComplaintEntity[] {
    return data.map((item) => this.toEntity(item));
  }

  static toDto(entity: ComplaintEntity): ComplaintResponseDTO {
    const user = entity.userId;
    const creator = entity.creatorId;

    let userId = "";
    let userName = "Unknown";
    let creatorId = "";
    let creatorName = "Unknown";

    if (typeof user === "object" && user !== null) {
      userId = user._id?.toString() || "";
      userName = user.name || "Unknown";
    } else {
      userId = user?.toString() || "";
    }

    if (typeof creator === "object" && creator !== null) {
      creatorId = creator._id?.toString() || "";
      creatorName = creator.fullName || "Unknown";
    } else {
      creatorId = creator?.toString() || "";
    }

    return {
      id: entity._id?.toString() || "",
      userId,
      userName,
      creatorId,
      creatorName,
      bookingId: entity.bookingId?.toString() || entity.bookingId,
      reason: entity.reason,
      description: entity.description,
      status: entity.status,
      adminComment: entity.adminComment,
      createdAt: entity.createdAt!,
    };
  }
}
