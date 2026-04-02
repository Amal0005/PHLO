import type { IBaseRepository } from "@/domain/interfaces/repository/IBaseRepository";
import type { LeaveEntity } from "@/domain/entities/leaveEntity";

export interface ILeaveRepository extends IBaseRepository<LeaveEntity> {
  addLeave(leaveData: LeaveEntity): Promise<LeaveEntity>;
  removeLeave(creatorId: string, date: Date): Promise<boolean>;
  getLeavesByCreatorId(creatorId: string): Promise<LeaveEntity[]>;
  isDateBlocked(creatorId: string, date: Date): Promise<boolean>;
}
