import { ILeaveModel } from "@/framework/database/model/leaveModel";
import { BaseRepository } from "../baseRepository";
import { LeaveEntity } from "@/domain/entities/leaveEntity";
import { ILeaveRepository } from "@/domain/interface/repositories/ILeaveRepository";
import { LeaveModel } from "@/framework/database/model/leaveModel";

export class LeaveRepository extends BaseRepository<LeaveEntity, ILeaveModel> implements ILeaveRepository {
  constructor() {
    super(LeaveModel)
  }
  protected mapToEntity(doc: ILeaveModel): LeaveEntity {
    return {
      id: doc._id.toString(),
      creatorId: doc.creatorId.toString(),
      date: doc.date,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    };
  }
  async addLeave(leaveData: LeaveEntity): Promise<LeaveEntity> {
    const doc = await this.model.create(leaveData)
    return this.mapToEntity(doc)

  }
  async removeLeave(creatorId: string, date: Date): Promise<boolean> {
    const result = await this.model.deleteOne({ creatorId, date });
    return result.deletedCount > 0;
  }
  async getLeavesByCreatorId(creatorId: string): Promise<LeaveEntity[]> {
    const docs = await this.model.find({ creatorId }).sort({ date: 1 });
    return docs.map((doc) => this.mapToEntity(doc));
  }
  async isDateBlocked(creatorId: string, date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const match = await this.model.findOne({
      creatorId,
      date: startOfDay,
    });
    return !!match;
  }
}
