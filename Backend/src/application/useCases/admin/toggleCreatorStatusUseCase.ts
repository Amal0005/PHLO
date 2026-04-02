import type { IToggleCreatorStatusUseCase } from "@/domain/interfaces/admin/IToggleCreatorStatusUseCase";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";

export class ToggleCreatorStatusUseCase implements IToggleCreatorStatusUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) {}

    async toggleStatus(creatorId: string, status: "approved" | "blocked"): Promise<void> {
        await this._creatorRepo.updateStatus(creatorId, status)
    }

}
