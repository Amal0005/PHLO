import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import { IGetCreatorProfileUseCase } from "@/domain/interface/creator/profile/IGetCreatorProfileUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class GetCreatorProfileUseCase implements IGetCreatorProfileUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository
    ) {}
    async getProfile(creatorId: string): Promise<CreatorResponseDto | null> {
        const creator = await this._creatorRepo.findById(creatorId);
        return creator ? CreatorMapper.toDto(creator) : null;
    }
}
