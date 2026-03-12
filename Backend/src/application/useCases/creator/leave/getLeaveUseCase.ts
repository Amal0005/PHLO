import { LeaveMapper } from "@/application/mapper/creator/creatorLeaveMapper";
import { LeaveResponseDto } from "@/domain/dto/creator/leaveDto";
import { IGetLeavesUseCase } from "@/domain/interface/creator/leave/IGetLeaveUseCase";
import { ILeaveRepository } from "@/domain/interface/repository/ILeaveRepository";

export class GetLeavesUseCase implements IGetLeavesUseCase {
  constructor(
    private _leaveRepository: ILeaveRepository

  ) {}

  async getLeave(creatorId: string): Promise<LeaveResponseDto[]> {
    const leaves = await this._leaveRepository.getLeavesByCreatorId(creatorId);
    return leaves.map((item) => LeaveMapper.toResponseDto(item));
  }
}
