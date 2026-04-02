import type { IRejectCreatorUseCase } from "@/domain/interfaces/admin/IRejectCreatorUseCase";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import { MESSAGES } from "@/constants/commonMessages";

export class RejectCreatorUseCase implements IRejectCreatorUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository

    ) {}

    async rejectCreator(creatorId: string, reason: string): Promise<void> {
        if (!creatorId) throw new Error(MESSAGES.ADMIN.CREATOR_ID_REQUIRED);
        await this._creatorRepo.updateStatus(creatorId, "rejected", reason);
    }
}

