import { ILeaveRepository } from "@/domain/interface/repositories/ILeaveRepository";
import { IAddLeaveUseCase } from "@/domain/interface/creator/leave/IAddLeaveUseCase";
import { AddLeaveRequestDto, LeaveResponseDto } from "@/domain/dto/creator/leaveDto";
import { LeaveMapper } from "@/application/mapper/creator/creatorLeaveMapper";

export class AddLeaveUseCase implements IAddLeaveUseCase {
  constructor(
    private _leaveRepository: ILeaveRepository
) {}

  async addLeave(dto: AddLeaveRequestDto): Promise<LeaveResponseDto> {
    const date = new Date(dto.date);
    date.setUTCHours(0, 0, 0, 0);

    const isBlocked = await this._leaveRepository.isDateBlocked(dto.creatorId, date);
    if (isBlocked) {
      throw new Error("Date is already blocked.");
    }

    const savedEntity = await this._leaveRepository.addLeave({ creatorId: dto.creatorId, date });
    return LeaveMapper.toResponseDto(savedEntity);
  }
}
