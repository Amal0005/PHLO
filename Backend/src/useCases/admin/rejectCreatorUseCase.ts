import { IRejectCreatorUseCase } from "../../domain/interface/admin/IRejectCreatorUseCase";
import { ICreatorRepository } from "../../domain/interface/creator/ICreatorRepository";

export class RejectCreatorUseCase implements IRejectCreatorUseCase {
    constructor(private _creatorRepo: ICreatorRepository) { }

    async rejectCreator(creatorId: string, reason: string): Promise<void> {
        if (!creatorId) throw new Error("CreatorId is missing");
        await this._creatorRepo.updateStatus(creatorId, "rejected", reason);
    }
}

