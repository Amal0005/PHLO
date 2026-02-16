import { IToggleCreatorStatusUseCase } from "@/domain/interface/admin/IToggleCreatorStatusUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class ToggleCreatorStatusUseCase implements IToggleCreatorStatusUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) {}

    async execute(creatorId: string, status: "approved" | "blocked"): Promise<void> {
        await this._creatorRepo.updateStatus(creatorId, status)
    }

}
