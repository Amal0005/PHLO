import { IBaseRepository } from "@/domain/interface/repositories/IBaseRepository";
import { LeaveEntity } from "../../entities/leaveEntity";

export interface ILeaveRepository extends IBaseRepository<LeaveEntity> {
  addLeave(leaveData: LeaveEntity): Promise<LeaveEntity>;
  removeLeave(creatorId: string, date: Date): Promise<boolean>;
  getLeavesByCreatorId(creatorId: string): Promise<LeaveEntity[]>;
  isDateBlocked(creatorId: string, date: Date): Promise<boolean>;
}
