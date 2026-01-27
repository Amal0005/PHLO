import { IToggleUserStatusUseCase } from "../../domain/interface/admin/IToggleUserStatusUseCase";
import { IuserRepository } from "../../domain/interface/user/IuserRepository";

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(private _userRepo: IuserRepository) { }

    async execute(userId: string, status: "active" | "blocked"): Promise<void> {
        await this._userRepo.updateUserStatus(userId, status);
    }
}
