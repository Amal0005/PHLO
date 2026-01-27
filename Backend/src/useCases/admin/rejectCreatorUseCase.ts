import { IrejectCreatorUseCase } from "../../domain/interface/admin/IrejectCreatorUseCase";
import { IcreatorRepository } from "../../domain/interface/creator/IcreatorRepository";

export class RejectCreatorUseCase implements IrejectCreatorUseCase {
    constructor(private _creatorRepo: IcreatorRepository) { }

    async rejectCreator(creatorId: string, reason: string): Promise<void> {
        if (!creatorId) throw new Error("CreatorId is missing");
        await this._creatorRepo.updateStatus(creatorId, "rejected", reason);
    }
}
