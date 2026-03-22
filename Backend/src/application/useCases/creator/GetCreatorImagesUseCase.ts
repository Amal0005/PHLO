import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IGetPresignedViewUrlUseCase } from "@/domain/interface/creator/IGetPresignedViewUrlUseCase";
import { IGetCreatorImagesUseCase, CreatorImagesDto } from "@/domain/interface/creator/IGetCreatorImagesUseCase";

export class GetCreatorImagesUseCase implements IGetCreatorImagesUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _getPresignedViewUrlUseCase: IGetPresignedViewUrlUseCase
    ) {}

    async execute(email: string): Promise<CreatorImagesDto | null> {
        const creator = await this._creatorRepo.findByEmail(email);
        if (!creator) {
            return null;
        }

        return {
            profilePhoto: creator.profilePhoto
                ? await this._getPresignedViewUrlUseCase.execute(creator.profilePhoto)
                : null,
            governmentId: creator.governmentId
                ? await this._getPresignedViewUrlUseCase.execute(creator.governmentId)
                : null,
        };
    }
}
