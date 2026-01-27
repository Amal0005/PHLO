import { IapproveCreatorUseCase } from "../../domain/interface/admin/IapproveCreatorUseCase";
import { IcreatorRepository } from "../../domain/interface/creator/IcreatorRepository";

export class ApproveCreatorUseCase implements IapproveCreatorUseCase {
    constructor(private _creatorRepo: IcreatorRepository) { }

    async approveCreator(creatorId: string): Promise<void> {
        if (!creatorId) throw new Error("CreatorId is missing");
        await this._creatorRepo.updateStatus(creatorId, "approved");
    }
}
