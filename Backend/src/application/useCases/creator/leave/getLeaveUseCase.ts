import { LeaveMapper } from "@/application/mapper/creator/creatorLeaveMapper";
import type { LeaveResponseDto } from "@/domain/dto/creator/leaveDto";
import type { IGetLeavesUseCase } from "@/domain/interfaces/creator/leave/IGetLeaveUseCase";
import type { ILeaveRepository } from "@/domain/interfaces/repository/ILeaveRepository";

export class GetLeavesUseCase implements IGetLeavesUseCase {
  constructor(
    private _leaveRepository: ILeaveRepository

  ) {}

  async getLeave(creatorId: string): Promise<LeaveResponseDto[]> {
    const leaves = await this._leaveRepository.getLeavesByCreatorId(creatorId);
    return leaves.map((item) => LeaveMapper.toResponseDto(item));
  }
}
