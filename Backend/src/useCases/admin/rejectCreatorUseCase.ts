import { IRejectCreatorUseCase } from "@/domain/interface/admin/IRejectCreatorUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { MESSAGES } from "@/utils/commonMessages";

export class RejectCreatorUseCase implements IRejectCreatorUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository

    ) {}

    async rejectCreator(creatorId: string, reason: string): Promise<void> {
        if (!creatorId) throw new Error(MESSAGES.ADMIN.CREATOR_ID_REQUIRED);
        await this._creatorRepo.updateStatus(creatorId, "rejected", reason);
    }
}

