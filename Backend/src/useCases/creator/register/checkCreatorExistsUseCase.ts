import { IcheckCreatorExistsUseCase } from "@/domain/interface/creator/register/IcheckCreatorExistsUseCase";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";

export class CheckCreatorExistsUseCase implements IcheckCreatorExistsUseCase {
    constructor(private _creatorRepo: IcreatorRepository) { }

    async checkExists(email: string): Promise<void> {
        const existing = await this._creatorRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email already in use");
        }
    }
}
