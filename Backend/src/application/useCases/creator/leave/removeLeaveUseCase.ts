import type { ILeaveRepository } from "@/domain/interface/repository/ILeaveRepository";
import type { IRemoveLeaveUseCase } from "@/domain/interface/creator/leave/IRemoveLeaveUseCase";

export class RemoveLeaveUseCase implements IRemoveLeaveUseCase {
  constructor(private leaveRepository: ILeaveRepository) {}

  async removeLeave(creatorId: string, dateString: Date): Promise<boolean> {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return await this.leaveRepository.removeLeave(creatorId, date);
  }
}
