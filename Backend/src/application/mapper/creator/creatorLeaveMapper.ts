import type { LeaveResponseDto } from "@/domain/dto/creator/leaveDto";
import type { LeaveEntity } from "@/domain/entities/leaveEntity";

export class LeaveMapper {
  static toResponseDto(entity: LeaveEntity): LeaveResponseDto {
    return {
      id: entity.id as string,
      creatorId: entity.creatorId,
      date: entity.date,
      createdAt: entity.createdAt,
    };
  }
}
