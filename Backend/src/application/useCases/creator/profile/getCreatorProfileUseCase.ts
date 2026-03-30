import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import type { IGetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IGetCreatorProfileUseCase";
import type { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";

export class GetCreatorProfileUseCase implements IGetCreatorProfileUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) {}
    async getProfile(creatorId: string): Promise<CreatorResponseDto | null> {
        const creator = await this._creatorRepo.findById(creatorId);
        return creator ? CreatorMapper.toDto(creator) : null;
    }
}
