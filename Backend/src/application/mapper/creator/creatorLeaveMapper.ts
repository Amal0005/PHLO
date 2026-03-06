import { LeaveResponseDto } from "@/domain/dto/creator/leaveDto";
import { LeaveEntity } from "@/domain/entities/leaveEntity";
import { Document } from "mongoose";

export interface LeaveDocument extends LeaveEntity, Document {}

export class LeaveMapper {
  static toEntity(doc: LeaveDocument): LeaveEntity {
    return {
      id: doc._id.toString(),
      creatorId: doc.creatorId.toString(),
      date: doc.date,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDto(entity: LeaveEntity): LeaveResponseDto {
    return {
      id: entity.id as string,
      creatorId: entity.creatorId,
      date: entity.date,
      createdAt: entity.createdAt,
    };
  }
}
