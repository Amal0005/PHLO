import { ItoggleCreatorStatusUseCase } from "@/domain/interface/admin/ItoggleCreatorStatusUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";

export class ToggleCreatorStatusUseCase implements ItoggleCreatorStatusUseCase{
    constructor(
        private _creatorRepo:IcreatorRepository
    ){}

    async execute(creatorId: string, status: "approved" | "blocked"): Promise<void> {
        await this._creatorRepo.updateStatus(creatorId,status)
    }

}