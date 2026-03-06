import { LeaveResponseDto } from "@/domain/dto/creator/leaveDto";

export interface IGetLeavesUseCase {
  getLeave(creatorId: string): Promise<LeaveResponseDto[]>;
}
