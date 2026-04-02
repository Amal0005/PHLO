import type { AddLeaveRequestDto, LeaveResponseDto } from "@/domain/dto/creator/leaveDto";

export interface IAddLeaveUseCase {
  addLeave(dto: AddLeaveRequestDto): Promise<LeaveResponseDto>;
}
