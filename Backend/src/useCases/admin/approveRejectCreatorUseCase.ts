import { IapproveRejectCreatorUseCase } from "../../domain/interface/admin/IapproveRejectCreatorUseCase";
import { IcreatorRepository } from "../../domain/interface/creator/IcreatorRepository";

export class ApproveRejectCreatorUseCase
  implements IapproveRejectCreatorUseCase
{
  constructor(private _creatorRepo: IcreatorRepository) {}
  async approveCreator(creatorId: string): Promise<void> {
    if (!creatorId) throw new Error("CreatorId is missing");
    await this._creatorRepo.updateStatus(creatorId, "approved");
  }
  async rejectCreator(creatorId: string): Promise<void> {
    if (!creatorId) throw new Error("CreatorId is missing");
    await this._creatorRepo.updateStatus(creatorId, "rejected");
  }
}
